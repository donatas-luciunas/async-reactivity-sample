import { Listener } from "async-reactivity";
export default class AsyncListener<T> extends Listener<Promise<T>> {
    private promiseActions?;
    constructor({ start, stop }: {
        start: (setter: (value: T) => void) => void;
        stop: () => void;
    });
}
//# sourceMappingURL=AsyncListener.d.ts.map