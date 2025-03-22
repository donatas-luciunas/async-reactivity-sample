import LiveQuery from "./LiveQuery";

export default class Connection {
    private socket: WebSocket;
    private queries: LiveQuery[] = [];

    constructor(socket: WebSocket) {
        this.socket = socket;
        socket.addEventListener('message', this.onMessage);
    }

    private onMessage(event: MessageEvent) {
        const message = JSON.parse(event.data.toString());
        if (message.set) {
            const query = this.queries[0];  // todo
            const reference = query[message.set.path];  // todo
            reference.value = message.set.value;
        } else if (message.watch) {
            // todo
        } else if (message.unwatch) {
            // todo
        }
    }

    add(query: LiveQuery) {
        this.queries.push(query);
    }

    watch(path: string) {
        this.socket.send(JSON.stringify({
            watch: {
                path
            }
        }));
    }

    unwatch(path: string) {
        this.socket.send(JSON.stringify({
            unwatch: {
                path
            }
        }));
    }

    [Symbol.dispose]() {
        this.socket.removeEventListener('message', this.onMessage);
    }
}