import { Dependency } from "async-reactivity";
import { Query } from "async-reactivity-net";

export default abstract class SampleQuery extends Query {
    abstract b: Dependency<Promise<boolean>>;
    abstract invert: Dependency<Promise<boolean>>;
}