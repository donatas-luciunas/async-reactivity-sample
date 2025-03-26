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

    readonly counts: Computed<Promise<{ done: number; notDone: number }>>;

    constructor() {
        super();

        this.items = this.register(new Computed(async (value, previousValue) => {
            const previousItems = new Map(((await previousValue) ?? []).map(i => [i.id, i]));

            const dataItems = await value(this.dataItems);

            return dataItems.map(i => {
                const item = previousItems.get(i.id);

                if (item) {
                    item.text.value = i.text;
                    item.done.value = i.done;
                    return item;
                }

                return new Item(i);
            });
        }, undefined, 5 * 1000));

        this.counts = this.register(new Computed(async (value) => {
            const items = await value(this.items);

            const result = {
                done: 0,
                notDone: 0
            };

            for (const i of items) {
                if (value(i.done)) {
                    result.done++;
                } else {
                    result.notDone++;
                }
            }

            return result;
        }));
    }
}