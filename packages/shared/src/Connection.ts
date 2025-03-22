import { WebSocket, MessageEvent } from 'ws';
import LiveQuery from "./LiveQuery.js";
import { Dependency, Ref, Watcher } from 'async-reactivity';

interface BaseMessage {
    liveQuery: {
        type: string;
        id: string;
    };
    path: string;
}

interface SetMessage extends BaseMessage {
    value: any;
}

interface Message {
    set?: SetMessage;
    watch?: BaseMessage;
    unwatch?: BaseMessage;
}

const getLiveQueryKey = (type: string, id: string) => `${type}-${id}`;

type LiveQueryConstructor = new (connection: Connection, id?: string) => LiveQuery;

export default class Connection {
    private socket: WebSocket;
    private liveQueries = new Map<string, LiveQuery>();

    private liveQueryTypes: Map<string, LiveQueryConstructor>;
    private watchers = new Map<Dependency<any>, Watcher<any>>();

    constructor(socket: WebSocket, liveQueryTypes: LiveQueryConstructor[]) {
        this.socket = socket;
        this.liveQueryTypes = new Map(liveQueryTypes.map(t => [t.name, t]));

        socket.addEventListener('close', () => this[Symbol.dispose]());

        socket.addEventListener('message', (event: MessageEvent) => {
            const message: Message = JSON.parse(event.data.toString());
            const liveQueryHead = (message.set ?? message.watch ?? message.unwatch)!.liveQuery;
            const liveQuery = this.getCreateLiveQuery(liveQueryHead);
            const path = (message.set ?? message.watch ?? message.unwatch)!.path;
            // @ts-expect-error
            const reference: Dependency<any> = liveQuery[path];  // todo better resolution
            if (message.set) {
                (reference as Ref<any>).value = Promise.resolve(message.set.value);
            } else if (message.watch) {
                if (!this.watchers.has(reference)) {
                    this.watchers.set(reference, new Watcher(reference, async (value) => {
                        this.socket.send(JSON.stringify({
                            set: {
                                liveQuery: {
                                    type: liveQuery.constructor.name,
                                    id: liveQuery.id,
                                },
                                path,
                                value: await value
                            }
                        }));
                    }));
                } else {
                    console.warn(`watcher already exist`, message);
                }
            } else if (message.unwatch) {
                const w = this.watchers.get(reference);
                w?.dispose();
                this.watchers.delete(reference);
            }
        });
    }

    private getCreateLiveQuery(liveQueryHead: { type: string; id: string }) {
        const key = getLiveQueryKey(liveQueryHead.type, liveQueryHead.id);
        let liveQuery = this.liveQueries.get(key);
        if (!liveQuery) {
            const type = this.liveQueryTypes.get(liveQueryHead.type)!;
            liveQuery = new type(this, liveQueryHead.id);
            this.liveQueries.set(key, liveQuery);
        }
        return liveQuery;
    }

    add(liveQuery: LiveQuery) {
        this.liveQueries.set(getLiveQueryKey(liveQuery.constructor.name, liveQuery.id), liveQuery);
    }

    watch(liveQuery: LiveQuery, path: string) {
        this.socket.send(JSON.stringify({
            watch: {
                liveQuery: {
                    type: liveQuery.constructor.name,
                    id: liveQuery.id
                },
                path
            }
        }));
    }

    unwatch(liveQuery: LiveQuery, path: string) {
        this.socket.send(JSON.stringify({
            unwatch: {
                liveQuery: {
                    type: liveQuery.constructor.name,
                    id: liveQuery.id
                },
                path
            }
        }));
    }

    [Symbol.dispose]() {
        for (const liveQuery of this.liveQueries.values()) {
            liveQuery[Symbol.dispose]();
        }
    }
}