import { Connection, ConnectionListener, LiveQuery, newId } from "async-reactivity-net";
import { Ref } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import { DataItem } from "../data.js";

export default class SampleLiveQuery extends BaseSampleQuery implements LiveQuery {
    readonly dataItems: ConnectionListener<DataItem[], SampleLiveQuery>;
    
    readonly filters: {
        done: Ref<Promise<boolean | null>>;
        text: Ref<Promise<string | null>>;
    };

    constructor(readonly connection: Connection, readonly id: string = newId()) {
        super();

        this.filters = {
            done: new Ref(Promise.resolve(null)),
            text: new Ref(Promise.resolve(null))
        };

        this.dataItems = new ConnectionListener(this, async q => q.dataItems);
    }
}