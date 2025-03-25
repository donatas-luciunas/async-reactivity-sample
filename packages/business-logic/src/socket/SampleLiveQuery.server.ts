import { Connection, ConnectionListener, LiveQuery, newId } from "async-reactivity-net";
import BaseSampleServerQuery from './SampleQuery.server.js';

export default class SampleLiveQuery extends BaseSampleServerQuery implements LiveQuery {
    readonly filters: {
        done: ConnectionListener<boolean | null, SampleLiveQuery>;
        text: ConnectionListener<string | null, SampleLiveQuery>;
    };

    constructor(public readonly connection: Connection, readonly id: string = newId()) {
        super();

        this.filters = {
            done: new ConnectionListener(this, async q => q.filters.done),
            text: new ConnectionListener(this, async q => q.filters.text)
        };
    }
}