import { Watcher } from 'async-reactivity';
import { b } from './state.js';

export default (wss) => {
    wss.on('connection', (ws) => {
        let w;

        ws.on('error', console.error);

        ws.on('message', function message(data) {
            const str = data.toString();
            console.log(`socket | ${str}`);
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
};