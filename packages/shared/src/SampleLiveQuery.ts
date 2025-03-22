import { Dependency } from "async-reactivity";
import LiveQuery from "./LiveQuery";

export default abstract class SampleLiveQuery extends LiveQuery {
    abstract b: Dependency<Promise<Boolean>>;
    abstract invert: Dependency<Promise<Boolean>>;
}