import { Dependent } from "async-reactivity";
export default abstract class LiveQuery {
    private dependents;
    protected register: <T extends Dependent>(d: T) => T;
    [Symbol.dispose](): void;
}
//# sourceMappingURL=LiveQuery.d.ts.map