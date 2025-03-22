import AsyncListener from "./AsyncListener";
export default class ConnectionListener extends AsyncListener {
    constructor(connection, path) {
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
