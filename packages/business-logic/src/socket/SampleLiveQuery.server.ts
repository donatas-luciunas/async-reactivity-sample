import { Connection, ConnectionListener, LiveQuery, newId } from "async-reactivity-net";
import BaseSampleServerQuery from './SampleQuery.server.js';
import { Ref } from "async-reactivity";

export default class SampleLiveQuery extends BaseSampleServerQuery implements LiveQuery {
    readonly token: Ref<Promise<string>>;
    
    readonly filters: {
        done: ConnectionListener<boolean | null, SampleLiveQuery>;
        text: ConnectionListener<string | null, SampleLiveQuery>;
    };

    constructor(public readonly connection: Connection, readonly id: string = newId()) {
        super();

        this.token = new ConnectionListener(this, async q => q.token);

        this.filters = {
            done: new ConnectionListener(this, async q => q.filters.done),
            text: new ConnectionListener(this, async q => q.filters.text)
        };
    }
}