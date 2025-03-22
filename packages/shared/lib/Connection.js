export default class Connection {
    socket;
    queries = [];
    constructor(socket) {
        this.socket = socket;
        socket.addEventListener('message', this.onMessage);
    }
    onMessage(event) {
        const message = JSON.parse(event.data.toString());
        if (message.set) {
            const query = this.queries[0]; // todo
            const reference = query[message.set.path]; // todo
            reference.value = message.set.value;
        }
        else if (message.watch) {
            // todo
        }
        else if (message.unwatch) {
            // todo
        }
    }
    add(query) {
        this.queries.push(query);
    }
    watch(path) {
        this.socket.send(JSON.stringify({
            watch: {
                path
            }
        }));
    }
    unwatch(path) {
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
