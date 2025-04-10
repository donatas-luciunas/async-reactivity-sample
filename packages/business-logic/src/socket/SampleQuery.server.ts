import { Computed, Ref } from "async-reactivity";
import BaseSampleNodeQuery from './SampleQuery.node.js';
import { list, subscribe, unsubscribe } from "../data.js";

export default class SampleQuery extends BaseSampleNodeQuery {
    readonly token: Ref<string>;

    readonly filters: {
        done: Ref<boolean | null>;
        text: Ref<string | null>;
    };

    readonly dataItems: Computed<Promise<string[]>>;
    readonly dataItemsInvalidate: Function;

    constructor() {
        super();

        this.token = new Ref('server-token');

        this.filters = {
            done: new Ref(null),
            text: new Ref(null)
        };

        this.dataItems = new Computed(async value => {
            if (!(value(this.token))) {
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