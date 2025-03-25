import { WebSocketServer } from 'ws';
import { Computed } from 'async-reactivity';
import { Connection, ConnectionListener } from 'async-reactivity-net';
import { SampleLiveQuery as BaseSampleLiveQuery } from '@async-reactivity-sample/business-logic';
import { b } from './state.js';

class SampleLiveQuery extends BaseSampleLiveQuery {
    public readonly invert: ConnectionListener<boolean, SampleLiveQuery>;
    public readonly b: Computed<Promise<boolean>>;

    constructor(connection: Connection, id?: string) {
        super(connection, id);

        this.invert = new ConnectionListener(this, async q => q.invert);

        this.b = this.register(new Computed(async value => {
            const i = await value(this.invert);
            console.log(`socket | get (invert=${i})`);
            if (i) {
                return !value(b);
            }
            return value(b);
        }));
    }
}

export default (wss: WebSocketServer) => {
    wss.on('connection', (ws) => {
        new Connection(ws, [SampleLiveQuery]);
    });
};