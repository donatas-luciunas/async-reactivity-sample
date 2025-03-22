import { Listener } from "async-reactivity";

export default class AsyncListener<T> extends Listener<Promise<T>> {
    private promiseActions?: { resolve: Function, reject: Function };

    constructor({ start, stop }: { start: (setter: (value: T) => void) => void, stop: () => void }) {
        super({
            init: () => new Promise<T>((resolve, reject) => {
                this.promiseActions = {
                    resolve,
                    reject
                };
            }),
            start: (setter) => {
                return start(value => {
                    if (this.promiseActions) {
                        this.promiseActions.resolve(value);
                        this.promiseActions = undefined;
                    } else {
                        setter(Promise.resolve(value));
                    }
                });
            },
            stop
        })
    }
}