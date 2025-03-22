import { Dependent } from "async-reactivity";

export default abstract class LiveQuery {
    private dependents: Dependent[] = [];

    protected register = <T extends Dependent>(d: T): T => {
        this.dependents.push(d);
        return d;
    };

    [Symbol.dispose]() {
        for (const d of this.dependents) {
            d.dispose();
        }
    }
}