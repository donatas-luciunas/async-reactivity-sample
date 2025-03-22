import { WebSocketServer } from 'ws';
import { Computed } from 'async-reactivity';
import { Connection, SampleLiveQuery as BaseSampleLiveQuery, AsyncListener } from '@async-reactivity-sample/shared';
import * as state from './state.js';

export class SampleLiveQuery extends BaseSampleLiveQuery {
    b: Computed<Promise<boolean>>;
    invert: AsyncListener<boolean>;

    constructor(connection: Connection, id?: string) {
        super(connection, id);

        this.b = new Computed(async value => {
            const i = await value(this.invert);
            if (i) {
                return !value(state.b);
            }
            return value(state.b);
        });

        this.invert = new AsyncListener<boolean>(
            () => this.connection.watch(this, 'invert'),
            () => this.connection.unwatch(this, 'invert')
        );
    }
}

export default (wss: WebSocketServer) => {
    wss.on('connection', (ws) => {
        new Connection(ws, [SampleLiveQuery]);
    });
};