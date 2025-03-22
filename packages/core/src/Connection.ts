import { WebSocket, MessageEvent } from 'ws';
import { Dependency, Ref, Watcher } from 'async-reactivity';
import LiveQuery from "./LiveQuery.js";

interface Message {
    liveQuery: {
        type: string;
        id: string;
    };
    path: string;
    set?: any;
    watch?: boolean;
    unwatch?: boolean;
}

const getLiveQueryKey = (type: string, id: string) => `${type}-${id}`;

type LiveQueryConstructor = new (connection: Connection, id?: string) => LiveQuery;

export default class Connection {
    private socket: WebSocket;
    private liveQueryTypes: Map<string, LiveQueryConstructor>;
    private liveQueries = new Map<string, LiveQuery>();
    private watchers = new Map<Dependency<any>, Watcher<any>>();

    constructor(socket: WebSocket, liveQueryTypes: LiveQueryConstructor[]) {
        this.socket = socket;
        this.liveQueryTypes = new Map(liveQueryTypes.map(t => [t.name, t]));

        socket.addEventListener('close', () => this[Symbol.dispose]());

        socket.addEventListener('message', (event: MessageEvent) => {
            const message: Message = JSON.parse(event.data.toString());

            const liveQuery = this.getCreateLiveQuery(message.liveQuery);

            // @ts-expect-error
            const reference: Dependency<any> = liveQuery[message.path];  // todo better resolution

            if (message.watch) {
                if (!this.watchers.has(reference)) {
                    this.watchers.set(reference, new Watcher(reference, async (value) => {
                        this.socket.send(JSON.stringify({
                            liveQuery: {
                                type: liveQuery.constructor.name,
                                id: liveQuery.id,
                            },
                            path: message.path,
                            set: await value
                        }));
                    }));
                }
            } else if (message.unwatch) {
                const w = this.watchers.get(reference);
                this.watchers.delete(reference);
                w?.dispose();
            } else {
                (reference as Ref<any>).value = Promise.resolve(message.set);
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
        const key = getLiveQueryKey(liveQuery.constructor.name, liveQuery.id);
        this.liveQueries.set(key, liveQuery);
    }

    watch(liveQuery: LiveQuery, path: string) {
        this.socket.send(JSON.stringify({
            liveQuery: {
                type: liveQuery.constructor.name,
                id: liveQuery.id
            },
            path,
            watch: true
        }));
    }

    unwatch(liveQuery: LiveQuery, path: string) {
        this.socket.send(JSON.stringify({
            liveQuery: {
                type: liveQuery.constructor.name,
                id: liveQuery.id
            },
            path,
            unwatch: true
        }));
    }

    [Symbol.dispose]() {
        for (const liveQuery of this.liveQueries.values()) {
            liveQuery[Symbol.dispose]();
        }
        for (const watcher of this.watchers.values()) {
            watcher.dispose();
        }
        // todo: removeEventListeners
    }
}