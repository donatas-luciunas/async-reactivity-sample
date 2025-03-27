import { Watcher } from 'async-reactivity';
import { HttpSampleQuery, SocketSampleQuery } from "@async-reactivity-sample/business-logic";

{
    const query = new HttpSampleQuery();
    query.token.value = 'server-token';
    query.filters.done.value = false;
    
    new Watcher(query.items, async (itemsPromise) => {
        const items = await itemsPromise;
        const result = items.every(i => i.valid.value);
        if (!result) {
            console.warn('Invalid undone items exist');
        } else {
            console.log('All good');
        }
    });
}

{
    const query = new SocketSampleQuery();
    query.token.value = 'server-token';
    query.filters.done.value = false;

    new Watcher(query.items, async (itemsPromise) => {
        const items = await itemsPromise;
        const validity = await Promise.all(items.map(i => i.valid.value));
        const result = validity.every(v => v);
        if (!result) {
            console.warn('Invalid undone items exist');
        } else {
            console.log('All good');
        }
    });
}