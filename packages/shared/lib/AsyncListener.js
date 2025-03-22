import { Listener } from "async-reactivity";
export default class AsyncListener extends Listener {
    promiseActions;
    constructor({ start, stop }) {
        super({
            init: () => new Promise((resolve, reject) => {
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
                    }
                    else {
                        setter(Promise.resolve(value));
                    }
                });
            },
            stop
        });
    }
}
