import { Connection, ConnectionListener } from "async-reactivity-net";
import { Ref } from "async-reactivity";
import { Item } from "./data.js";
import BaseSampleLiveQuery from './SampleLiveQuery';

export default abstract class SampleLiveQuery extends BaseSampleLiveQuery {
    readonly data: ConnectionListener<Item[], SampleLiveQuery>;
    
    readonly filters: {
        done: Ref<Promise<boolean | null>>;
        text: Ref<Promise<string | null>>;
    };

    constructor(connection: Connection, id?: string) {
        super(connection, id);

        this.data = new ConnectionListener(this, async q => q.data);

        this.filters = {
            done: new Ref(Promise.resolve(null)),
            text: new Ref(Promise.resolve(null))
        };
    }
}