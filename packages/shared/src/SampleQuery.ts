import { Query } from "@async-reactivity-sample/core";
import { Dependency } from "async-reactivity";

export default abstract class SampleQuery extends Query {
    abstract b: Dependency<Promise<boolean>>;
    abstract invert: Dependency<Promise<boolean>>;
}