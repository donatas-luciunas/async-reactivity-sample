import { Connection, ConnectionListener, LiveQuery, newId } from "async-reactivity-net";
import { Ref } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import Item from './Item.browser.js';

export default class SampleLiveQuery extends BaseSampleQuery implements LiveQuery {
    readonly token: Ref<Promise<string>>;

    readonly dataItems: ConnectionListener<string[], SampleLiveQuery>;
    
    readonly filters: {
        done: Ref<Promise<boolean | null>>;
        text: Ref<Promise<string | null>>;
    };

    constructor(readonly connection: Connection, readonly id: string = newId()) {
        super(id => new Item(this, id));

        this.token = new Ref(Promise.resolve('client-token'));

        this.filters = {
            done: new Ref(Promise.resolve(null)),
            text: new Ref(Promise.resolve(null))
        };

        this.dataItems = new ConnectionListener(this, async q => q.dataItems);
    }
}