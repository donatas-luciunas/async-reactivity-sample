import { bind } from 'async-reactivity-vue';
import { DataItem } from '../data.js';
import BaseItem from './Item.js';

export default class Item extends BaseItem {
    readonly vue: {
        id: string;
        text: ReturnType<typeof bind<string>>;
        done: ReturnType<typeof bind<boolean>>;
        valid: ReturnType<typeof bind<boolean>>;
    }

    constructor(dataItem: DataItem) {
        super(dataItem);

        this.vue = {
            id: dataItem.id,
            text: bind(this.text),
            done: bind(this.done),
            valid: bind(this.valid)
        };
    }
}