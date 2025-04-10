import { Computed, Ref } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import { DataItem, list, subscribe, unsubscribe } from "../data.js";
import Item from "./Item.js";

export default class SampleQuery extends BaseSampleQuery {
    readonly token: Ref<string | undefined>;
    
    readonly dataItems: Computed<Promise<DataItem[]>>;
    readonly dataItemsInvalidate: Function;

    constructor() {
        super(item => new Item(item));

        this.token = new Ref(undefined);

        this.dataItems = new Computed(async value => {
            if (!value(this.token)) {
                throw new Error('Unauthorized');
            }

            const filters = {
                done: value(this.filters.done),
                text: value(this.filters.text)
            };

            let result = await list();

            if (filters.done !== null) {
                result = result.filter(i => i.done === filters.done);
            }

            if (filters.text) {
                result = result.filter(i => i.text.includes(filters.text!));
            }

            return result;
        }, undefined, 3 * 1000);

        this.dataItemsInvalidate = () => this.dataItems.forceInvalidate();
        subscribe(this.dataItemsInvalidate);
    }

    [Symbol.dispose]() {
        super[Symbol.dispose]();
        unsubscribe(this.dataItemsInvalidate);
    }

}