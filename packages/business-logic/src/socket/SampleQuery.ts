import { Computed, Dependency } from "async-reactivity";
import { Query } from "async-reactivity-net";
import Item from "./Item.js";

type Promisable<T> = Promise<T> | T;

export default abstract class SampleQuery extends Query {
    abstract readonly token: Dependency<Promisable<string>>;

    abstract readonly filters: {
        done: Dependency<Promisable<boolean | null>>;
        text: Dependency<Promisable<string | null>>;
    };

    abstract readonly dataItems: Dependency<Promise<string[]>>;

    readonly item: (id: string) => Item;
    private readonly itemEntities = new Map<string, Item>();
    readonly items: Computed<Promise<Item[]>>;

    constructor(createItem: (id: string) => Item) {
        super();

        this.item = (id: string) => {
            if (!this.itemEntities.has(id)) {
                this.itemEntities.set(id, createItem(id));
            }
            return this.itemEntities.get(id)!;
        };

        this.items = new Computed(async (value) => {
            const dataItems = await value(this.dataItems);
            return dataItems.map(id => this.item(id));
        }, undefined, 3 * 1000);
    }

    [Symbol.dispose]() {
        for (const item of this.itemEntities.values()) {
            item[Symbol.dispose]?.();
        }
        super[Symbol.dispose]();
    }
}