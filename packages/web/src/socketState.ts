import { Listener } from 'async-reactivity';

const socket = new WebSocket("ws://localhost:8080");
const opened = new Promise(resolve => socket.addEventListener("open", resolve));

let listener;
export const b = new Listener({
    init: () => true,
    start: async (setter) => {
        await opened;
        listener = (event: MessageEvent<any>) => {
            console.log("socket | set", event.data);
            setter(event.data === 'true');
        };
        socket.addEventListener("message", listener);
        socket.send("start");
    },
    stop: () => {
        socket.send("stop");
        socket.removeEventListener("message", listener!);
    }
});