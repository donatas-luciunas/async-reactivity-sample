import { Dependency } from "async-reactivity";
import LiveQuery from "./LiveQuery.js";

export default abstract class SampleLiveQuery extends LiveQuery {
    abstract b: Dependency<Promise<boolean>>;
    abstract invert: Dependency<Promise<boolean>>;
}