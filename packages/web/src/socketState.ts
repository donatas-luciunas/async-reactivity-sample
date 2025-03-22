import { Computed } from 'async-reactivity';
import { invert } from './query.js';
import { Connection, SampleLiveQuery as BaseSampleLiveQuery, AsyncListener } from '@async-reactivity-sample/shared';

const socket = new WebSocket("ws://localhost:8080");

export class SampleLiveQuery extends BaseSampleLiveQuery {
    b: AsyncListener<boolean>;
    invert: Computed<Promise<boolean>>;

    constructor(connection: Connection, id?: string) {
        super(connection, id);

        this.b = new AsyncListener<boolean>(
            () => this.connection.watch(this, 'b'),
            () => this.connection.unwatch(this, 'b')
        );
        
        this.invert = new Computed(value => Promise.resolve(value(invert)));
    }
}

const connection = new Connection(socket, [SampleLiveQuery]);

export const query = new SampleLiveQuery(connection);
connection.add(query);