import { Computed } from "async-reactivity";
import BaseItem from './Item.js';
import { get, subscribe, unsubscribe } from '../data.js';

export default class Item extends BaseItem {
    readonly text: Computed<Promise<string | undefined>>;
    readonly done: Computed<Promise<boolean | undefined>>;
    readonly invalidate: Function;

    constructor(id: string) {
        super(id);

        this.text = new Computed(async () => {
            const item = await get(id);
            return item?.text;
        }, undefined, 3 * 1000);

        this.done = new Computed(async () => {
            const item = await get(id);
            return item?.done;
        }, undefined, 3 * 1000);

        this.invalidate = () => {
            this.text.forceInvalidate();
            this.done.forceInvalidate();
        };
        subscribe(this.invalidate);
    }

    [Symbol.dispose]() {
        unsubscribe(this.invalidate);
    }
}