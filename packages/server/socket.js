import { Watcher } from 'async-reactivity';
import query from './query.js';

export default (wss) => {
    wss.on('connection', (ws) => {
        let w;
        let { invert, b } = query();

        ws.on('error', console.error);

        ws.on('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log(`socket | ${JSON.stringify(message)}`);
            if (message.set) {
                if (message.set === 'invert') {
                    invert.value = message.value;
                }
            } else if (message.listen) {
                w = new Watcher(b, (value) => {
                    ws.send(JSON.stringify({
                        set: "b",
                        value
                    }));
                }, true);
            } else if (message.unlisten) {
                w.dispose();
                w = undefined;
            }
        });
    });
};