import { Computed, Dependency, Ref } from "async-reactivity";
import { Query } from "async-reactivity-net";
import { DataItem } from "../data.js";
import Item from "../Item.js";

export default abstract class SampleQuery extends Query {
    abstract readonly token: Dependency<string | undefined>;

    readonly filters: {
        done: Ref<boolean | null>;
        text: Ref<string | null>;
    };

    abstract readonly dataItems: Dependency<Promise<DataItem[]>>;

    readonly items: Computed<Promise<Item[]>>;

    constructor() {
        super();

        this.filters = {
            done: new Ref(null),
            text: new Ref(null)
        };

        this.items = this.register(new Computed(async value => {
            const dataItems = await value(this.dataItems);
            return dataItems.map(i => new Item(i));
        }));
    }
}