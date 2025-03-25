import { Connection, LiveQuery } from "async-reactivity-net";
import { Computed, Dependency } from "async-reactivity";
import { Item } from "./data.js";

export default abstract class SampleLiveQuery extends LiveQuery {
    abstract readonly data: Dependency<Promise<Item[]>>;
    
    abstract readonly filters: {
        done: Dependency<Promise<boolean | null>>;
        text: Dependency<Promise<string | null>>;
    };

    constructor(connection: Connection, id?: string) {
        super(connection, id);
    }
}