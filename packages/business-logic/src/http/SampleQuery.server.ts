import { Computed, Ref } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import { DataItem, items } from "../data.js";

export default class SampleQuery extends BaseSampleQuery {
    readonly token: Ref<string | undefined>;
    
    readonly dataItems: Computed<Promise<DataItem[]>>;

    constructor() {
        super();

        this.token = new Ref(undefined);

        this.dataItems = this.register(new Computed(async value => {
            if (!value(this.token)) {
                throw new Error('Unauthorized');
            }

            const filters = {
                done: value(this.filters.done),
                text: value(this.filters.text)
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