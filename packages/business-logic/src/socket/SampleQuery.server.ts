import { Computed, Ref } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import { DataItem, get, subscribe, unsubscribe } from "../data.js";

export default class SampleQuery extends BaseSampleQuery {
    readonly token: Ref<Promise<string>>;

    readonly filters: {
        done: Ref<Promise<boolean | null>>;
        text: Ref<Promise<string | null>>;
    };

    readonly dataItems: Computed<Promise<DataItem[]>>;
    readonly dataItemsInvalidate: Function;

    constructor() {
        super();

        this.token = new Ref(Promise.resolve('server-token'));

        this.filters = {
            done: new Ref(Promise.resolve(null)),
            text: new Ref(Promise.resolve(null))
        };

        this.dataItems = this.register(new Computed(async value => {
            if (!(await value(this.token))) {
                throw new Error('Unauthorized');
            }

            const filters = {
                done: await value(this.filters.done),
                text: await value(this.filters.text)
            };

            let result = await get();

            if (filters.done !== null) {
                result = result.filter(i => i.done === filters.done);
            }

            if (filters.text !== null) {
                result = result.filter(i => i.text.includes(filters.text!));
            }

            return result;
        }, undefined, 5 * 1000));
        
        this.dataItemsInvalidate = () => this.dataItems.forceInvalidate();
        subscribe(this.dataItemsInvalidate);
    }

    [Symbol.dispose]() {
        super[Symbol.dispose]();
        unsubscribe(this.dataItemsInvalidate);
    }

}