import { Computed, Dependency } from "async-reactivity";
import { Query } from "async-reactivity-net";
import { DataItem } from "../data.js";
import Item from "../Item.js";

export default abstract class SampleQuery extends Query {
    abstract readonly token: Dependency<Promise<string>>;

    abstract readonly filters: {
        done: Dependency<Promise<boolean | null>>;
        text: Dependency<Promise<string | null>>;
    };

    abstract readonly dataItems: Dependency<Promise<DataItem[]>>;

    readonly items: Computed<Promise<Item[]>>;

    constructor() {
        super();

        this.items = this.register(new Computed(async value => {
            const dataItems = await value(this.dataItems);
            return dataItems.map(i => new Item(i));
        }));
    }
}