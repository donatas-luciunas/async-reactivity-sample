import { Computed } from 'async-reactivity';
import { Connection, ConnectionListener } from '@async-reactivity-sample/core';
import { SampleLiveQuery as BaseSampleLiveQuery } from '@async-reactivity-sample/shared';
import { invert } from './query.js';

const socket = new WebSocket("ws://localhost:8080");

export class SampleLiveQuery extends BaseSampleLiveQuery {
    public readonly invert: Computed<Promise<boolean>>;
    public readonly b: ConnectionListener<boolean>;

    constructor(connection: Connection, id?: string) {
        super(connection, id);

        // this.invert = invert; could be used, but type error occurs
        this.invert = this.register(new Computed(value => Promise.resolve(value(invert))));

        this.b = new ConnectionListener<boolean>(this, 'b');
    }
}

const connection = new Connection(socket, [SampleLiveQuery]);

const query = new SampleLiveQuery(connection);
connection.add(query);

export const b = query.b;