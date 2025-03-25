import { Computed, Dependency, Ref } from "async-reactivity";
import { Query } from "async-reactivity-net";
import { DataItem } from "../data.js";
import Item from "../Item.js";

export default abstract class SampleQuery extends Query {
    readonly filters: {
        done: Ref<Promise<boolean | null>>;
        text: Ref<Promise<string | null>>;
    };

    abstract readonly dataItems: Dependency<Promise<DataItem[]>>;

    readonly items: Computed<Promise<Item[]>>;

    constructor() {
        super();

        this.filters = {
            done: new Ref(Promise.resolve(null)),
            text: new Ref(Promise.resolve(null))
        };

        this.items = this.register(new Computed(async value => {
            const dataItems = await value(this.dataItems);
            return dataItems.map(i => new Item(i));
        }));
    }
}