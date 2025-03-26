import { Computed, Ref } from "async-reactivity";
import { DataItem } from "./data.js";

export default class Item {
    readonly id: Ref<string>;
    readonly text: Ref<string>;
    readonly done: Ref<boolean>;
    readonly valid: Computed<boolean>;

    constructor({ id, text, done }: DataItem) {
        this.id = new Ref(id);
        this.text = new Ref(text);
        this.done = new Ref(done);

        this.valid = new Computed(value => !!value(this.text));
    }
}