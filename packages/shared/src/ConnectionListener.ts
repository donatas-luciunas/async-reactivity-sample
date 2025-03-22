import AsyncListener from "./AsyncListener";
import Connection from "./Connection";

export default class ConnectionListener<T> extends AsyncListener<T> {
    constructor(connection: Connection, path: string) {
        super({
            start: (setter) => {
                connection.watch(path);
                // todo: call setter
            },
            stop: () => {
                connection.unwatch(path);
            }
        });
    }
}