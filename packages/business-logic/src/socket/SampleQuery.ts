import { Computed, Dependency } from "async-reactivity";
import { Query } from "async-reactivity-net";
import Item from "./Item.js";

export default abstract class SampleQuery extends Query {
    abstract readonly token: Dependency<Promise<string>>;

    abstract readonly filters: {
        done: Dependency<Promise<boolean | null>>;
        text: Dependency<Promise<string | null>>;
    };

    abstract readonly dataItems: Dependency<Promise<string[]>>;

    readonly item: (id: string) => Item;

    readonly items: Computed<Promise<Item[]>>;

    readonly counts: Computed<Promise<{ done: number; notDone: number }>>;

    constructor(createItem: (id: string) => Item) {
        super();

        {
            const items = new Map<string, Item>();
            this.item = (id: string) => {
                if (!items.has(id)) {
                    items.set(id, createItem(id));
                }
                return items.get(id)!;
            };
        }

        this.items = this.register(new Computed(async (value) => {
            const dataItems = await value(this.dataItems);
            return dataItems.map(id => this.item(id));
        }, undefined, 3 * 1000));

        this.counts = this.register(new Computed(async (value) => {
            const items = await value(this.items);

            const result = {
                done: 0,
                notDone: 0
            };

            for (const i of items) {
                if (await value(i.done)) {
                    result.done++;
                } else {
                    result.notDone++;
                }
            }

            return result;
        }, undefined, 3 * 1000));
    }
}