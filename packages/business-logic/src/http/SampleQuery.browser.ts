import { Computed } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import { DataItem } from "../data.js";

export default class SampleQuery extends BaseSampleQuery {
    readonly dataItems: Computed<Promise<DataItem[]>>;

    constructor() {
        super();

        this.dataItems = this.register(new Computed(async value => {
            // todo: server request
        }));
    }
}