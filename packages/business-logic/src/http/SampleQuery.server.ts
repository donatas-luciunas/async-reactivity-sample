import { Computed } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import { DataItem, items } from "../data.js";

export default class SampleQuery extends BaseSampleQuery {
    readonly dataItems: Computed<Promise<DataItem[]>>;

    constructor() {
        super();

        this.dataItems = this.register(new Computed(async value => {
            const filters = {
                done: await value(this.filters.done),
                text: await value(this.filters.text)
            };

            let result = items;

            if (filters.done !== null) {
                result = result.filter(i => i.done === filters.done);
            }

            if (filters.text !== null) {
                result = result.filter(i => i.text.includes(filters.text!));
            }

            return result;
        }));
    }

}