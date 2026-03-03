import { ConnectionListener } from "async-reactivity-net";
import BaseItem from './Item.js';
import SampleLiveQuery from "./SampleLiveQuery.browser.js";
import { bindAsync } from "async-reactivity-vue";

export default class Item extends BaseItem {
    readonly text: ConnectionListener<string | undefined, SampleLiveQuery>;
    readonly done: ConnectionListener<boolean | undefined, SampleLiveQuery>;

    readonly vue: {
        id: string;
        text: ReturnType<typeof bindAsync<string | undefined>>['data'];
        done: ReturnType<typeof bindAsync<boolean | undefined>>['data'];
        valid: ReturnType<typeof bindAsync<boolean>>['data'];
    }

    constructor(liveQuery: SampleLiveQuery, id: string) {
        super(id);

        this.text = new ConnectionListener(liveQuery, async q => q.item(id).text);

        this.done = new ConnectionListener(liveQuery, async q => q.item(id).done);

        this.vue = {
            id,
            text: bindAsync(this.text, '').data,
            done: bindAsync(this.done, false).data,
            valid: bindAsync(this.valid, true).data,
        };
    }
}