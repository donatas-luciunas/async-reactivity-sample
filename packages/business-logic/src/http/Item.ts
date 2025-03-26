import { Computed, Ref } from "async-reactivity";
import { DataItem } from "../data.js";

export default class Item {
    readonly id: string;
    readonly text: Ref<string>;
    readonly done: Ref<boolean>;
    readonly valid: Computed<boolean>;

    constructor({ id, text, done }: DataItem) {
        this.id = id;
        
        this.text = new Ref(text);
        this.done = new Ref(done);

        this.valid = new Computed(value => !!value(this.text));
    }
}