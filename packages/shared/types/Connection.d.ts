import LiveQuery from "./LiveQuery";
export default class Connection {
    private socket;
    private queries;
    constructor(socket: WebSocket);
    private onMessage;
    add(query: LiveQuery): void;
    watch(path: string): void;
    unwatch(path: string): void;
    [Symbol.dispose](): void;
}
//# sourceMappingURL=Connection.d.ts.map