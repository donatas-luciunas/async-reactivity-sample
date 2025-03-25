import { Connection, ConnectionListener, Query } from "async-reactivity-net";
import { Computed } from "async-reactivity";
import { Item, data } from "./data.js";
import BaseSampleLiveQuery from './SampleLiveQuery';

export default abstract class SampleLiveQuery extends BaseSampleLiveQuery {
    readonly data: Computed<Promise<Item[]>>;
    
    readonly filters: {
        done: ConnectionListener<boolean | null, SampleLiveQuery>;
        text: ConnectionListener<string | null, SampleLiveQuery>;
    };

    constructor(connection: Connection, id: string | undefined) {
        super(connection, id);

        this.data = new Computed(async (value) => {
            let result = value(data);
            const filters = {
                done: await value(this.filters.done),
                text: await value(this.filters.text)
            };

            if (filters.done !== null) {
                result = result.filter(i => i.done === filters.done);
            }

            if (filters.text !== null) {
                result = result.filter(i => i.text.includes(filters.text!));
            }

            return result;
        });

        this.filters = {
            done: new ConnectionListener(this, async q => q.filters.done),
            text: new ConnectionListener(this, async q => q.filters.text)
        };
    }
}