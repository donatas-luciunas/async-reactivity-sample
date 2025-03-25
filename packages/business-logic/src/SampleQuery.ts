import { Dependency } from "async-reactivity";
import { Query } from "async-reactivity-net";

export default abstract class SampleQuery extends Query {
    abstract readonly data: Dependency<Promise<Item[]>>;

    abstract readonly filters: {
        done: Dependency<Promise<boolean | null>>;
        text: Dependency<Promise<string | null>>;
    };
}