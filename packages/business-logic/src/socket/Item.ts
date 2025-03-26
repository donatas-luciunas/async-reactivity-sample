import { Computed, Dependency, Ref } from "async-reactivity";

export default abstract class Item {
    readonly id: string;
    abstract readonly text: Dependency<Promise<string | undefined>>;
    abstract readonly done: Dependency<Promise<boolean | undefined>>;
    readonly valid: Computed<Promise<boolean>>;

    constructor(id: string) {
        this.id = id;
        
        this.valid = new Computed(async value => {
            const text = await value(this.text);
            return !!text;
        }, undefined, 3 * 1000);
    }

    [Symbol.dispose]() { }
}