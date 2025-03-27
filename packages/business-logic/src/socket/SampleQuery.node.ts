import { Computed } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import Item from './Item.server.js';
import { list, subscribe, unsubscribe } from "../data.js";

export default abstract class SampleQuery extends BaseSampleQuery {
    readonly dataItems: Computed<Promise<string[]>>;
    readonly dataItemsInvalidate: Function;

    constructor() {
        super(id => new Item(id));

        this.dataItems = new Computed(async value => {
            if (!(await value(this.token))) {
                throw new Error('Unauthorized');
            }

            const filters = {
                done: await value(this.filters.done),
                text: await value(this.filters.text)
            };

            let result = await list();

            if (filters.done !== null) {
                result = result.filter(i => i.done === filters.done);
            }

            if (filters.text) {
                result = result.filter(i => i.text.includes(filters.text!));
            }

            return result.map(i => i.id);
        }, undefined, 3 * 1000);
        
        this.dataItemsInvalidate = () => this.dataItems.forceInvalidate();
        subscribe(this.dataItemsInvalidate);
    }

    [Symbol.dispose]() {
        super[Symbol.dispose]();
        unsubscribe(this.dataItemsInvalidate);
    }

}