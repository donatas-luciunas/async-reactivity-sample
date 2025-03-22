import { Listener, Ref, Watcher } from 'async-reactivity';
import { invert } from './query.js';
import { Connection, SampleLiveQuery, ConnectionListener } from '@async-reactivity-sample/shared';

const socket = new WebSocket("ws://localhost:8080");
const opened = new Promise(resolve => socket.addEventListener("open", resolve));

const connection = new Connection(socket);

export class ClientSampleLiveQuery extends SampleLiveQuery {
    b: ConnectionListener<Boolean>;
    invert: Ref<Promise<Boolean>>;

    constructor(connection: Connection) {
        super();

        this.b = new ConnectionListener<Boolean>(connection, 'b');
        this.invert = new Ref(Promise.resolve(false));
    }
}

const query = new ClientSampleLiveQuery(connection);
connection.add(query);
export default query;

let listener, watcher;
export const b = new Listener({
    init: () => true,
    start: async (setter) => {
        await opened;
        listener = (event: MessageEvent<any>) => {
            const message = JSON.parse(event.data);
            if (message?.set !== 'b') return;
            console.log("socket | set", message.value);
            setter(message.value);
        };
        watcher = new Watcher(invert, value => {
            socket.send(JSON.stringify({
                set: "invert",
                value
            }));
        }, true);
        socket.addEventListener("message", listener);
        socket.send(JSON.stringify({
            listen: "b"
        }));
    },
    stop: () => {
        socket.send(JSON.stringify({
            unlisten: "b"
        }));
        socket.removeEventListener("message", listener!);
        watcher!.dispose();
    }
});