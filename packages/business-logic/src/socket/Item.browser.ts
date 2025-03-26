import { ConnectionListener } from "async-reactivity-net";
import BaseItem from './Item.js';
import SampleLiveQuery from "./SampleLiveQuery.browser.js";

export default class Item extends BaseItem {
    readonly text: ConnectionListener<string | undefined, SampleLiveQuery>;
    readonly done: ConnectionListener<boolean | undefined, SampleLiveQuery>;

    constructor(liveQuery: SampleLiveQuery, id: string) {
        super(id);

        this.text = new ConnectionListener(liveQuery, async q => q.item(id).text);

        this.done = new ConnectionListener(liveQuery, async q => q.item(id).done);
    }
}