import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { Ref, Computed, Watcher } from 'async-reactivity';

const a = new Ref(5);
const b = new Computed(value => {
    const result = value(a) % 5 === 0;
    console.log('compute', result);
    return result;
});

const server = createServer();

const wss = new WebSocketServer({ server });

setInterval(() => {
    a.value = a.value + 1;
    console.log(a.value);
}, 1000);

wss.on('connection', function connection(ws) {
    let w;

    ws.on('error', console.error);

    ws.on('message', function message(data) {
        const str = data.toString();
        console.log(str);
        if (str === 'start') {
            w = new Watcher(b, (value) => {
                ws.send(value.toString());
            }, true);
        } else if (str === 'stop') {
            w.dispose();
            w = undefined;
        }
    });
});

server.listen(8080);