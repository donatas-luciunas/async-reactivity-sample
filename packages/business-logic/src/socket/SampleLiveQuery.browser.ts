import { Connection, ConnectionListener, LiveQuery, newId } from "async-reactivity-net";
import { Ref } from "async-reactivity";
import BaseSampleQuery from './SampleQuery.js';
import Item from './Item.browser.js';

export default class SampleLiveQuery extends BaseSampleQuery implements LiveQuery {
    readonly token: Ref<string>;

    readonly dataItems: ConnectionListener<string[], SampleLiveQuery>;
    
    readonly filters: {
        done: Ref<boolean | null>;
        text: Ref<string | null>;
    };

    constructor(readonly connection: Connection, readonly id: string = newId()) {
        super(id => new Item(this, id));

        this.token = new Ref('client-token');

        this.filters = {
            done: new Ref(null),
            text: new Ref(null)
        };

        this.dataItems = new ConnectionListener(this, async q => q.dataItems);
    }
}