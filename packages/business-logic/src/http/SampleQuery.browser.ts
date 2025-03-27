import { Computed, Ref } from "async-reactivity";
import { FetchBody, FetchQuery, FetchComputed } from 'async-reactivity-net';
import BaseSampleQuery from './SampleQuery.js';
import Item from "./Item.browser.js";
import { DataItem } from "../data.js";

export default class SampleQuery extends BaseSampleQuery implements FetchQuery {
    readonly token: Ref<string>;

    readonly dataItems: Computed<Promise<DataItem[]>>;

    constructor() {
        super(item => new Item(item));

        this.token = new Ref('client-token');

        this.dataItems = new FetchComputed(this, async (value, q) => {
            q.token.value = value(this.token);
            q.filters.done.value = value(this.filters.done);
            q.filters.text.value = value(this.filters.text);
            return q.dataItems;
        });
    }

    async fetch<T>(body: FetchBody) {
        const response = await fetch('http://localhost:8080/query', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        return result as T;
    }
}