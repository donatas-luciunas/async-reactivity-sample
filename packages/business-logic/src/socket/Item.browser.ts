import { ConnectionListener } from "async-reactivity-net";
import BaseItem from './Item.js';
import SampleLiveQuery from "./SampleLiveQuery.browser.js";
import { bindAwait } from "async-reactivity-vue";

export default class Item extends BaseItem {
    readonly text: ConnectionListener<string | undefined, SampleLiveQuery>;
    readonly done: ConnectionListener<boolean | undefined, SampleLiveQuery>;

    readonly vue: {
        id: string;
        text: ReturnType<typeof bindAwait<string | undefined>>['data'];
        done: ReturnType<typeof bindAwait<boolean | undefined>>['data'];
        valid: ReturnType<typeof bindAwait<boolean>>['data'];
    }

    constructor(liveQuery: SampleLiveQuery, id: string) {
        super(id);

        this.text = new ConnectionListener(liveQuery, async q => q.item(id).text);

        this.done = new ConnectionListener(liveQuery, async q => q.item(id).done);

        this.vue = {
            id,
            text: bindAwait(this.text, '').data,
            done: bindAwait(this.done, false).data,
            valid: bindAwait(this.valid, true).data,
        };
    }
}