<template>
    <h2>Filters</h2>
    <div>
        <label style="margin-right: 10px;">Filter by Text</label>
        <input v-model="text" />
    </div>
    <div style="margin-top: 10px">
        <label>
            <input type="checkbox" v-model="doneFilter" />
            Filter by Done
        </label>
        <label v-if="doneFilter">
            <input type="checkbox" v-model="doneValue" />
            Value
        </label>
    </div>
    <h2>Items</h2>
    <div>
        <button @click="show = !show">{{ show ? 'Collapse' : 'Expand' }}</button>
        <button style="margin-left: 10px;" @click="invalidate()">Invalidate</button>
    </div>
    <div v-if="show">
        <p>{{ counts.done }} done, {{ counts.notDone }} pending</p>
        <Item v-for="item of items" :key="item.id" :item="item" />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';

const text = ref('');
watch(text, debounce(() => {
    query.filters.text.value = text.value;
}, 500));

const doneFilter = ref(false);
const doneValue = ref(false);

watch([doneFilter, doneValue], ([filter, value]) => {
    query.filters.done.value = filter ? value : null;
});

const show = ref(false);

import { Ref, Computed } from 'async-reactivity';
import { DataItem, Item as ItemEntity } from '@async-reactivity-sample/business-logic';
class SampleQuery {
    readonly filters: {
        done: Ref<boolean | null>;
        text: Ref<string | null>;
    };

    readonly dataItems: Computed<Promise<DataItem[]>>;

    readonly items: Computed<Promise<ItemEntity[]>>;

    readonly counts: Computed<Promise<{ done: number; notDone: number }>>;

    constructor() {
        this.filters = {
            done: new Ref(null),
            text: new Ref(null)
        };

        this.dataItems = new Computed(async value => {
            const url = new URL('http://localhost:8080/items');
            url.searchParams.set('token', 'client-token');
            if (value(this.filters.done) !== null) {
                url.searchParams.set('done', value(this.filters.done)!.toString());
            }
            if (value(this.filters.text) !== null) {
                url.searchParams.set('text', value(this.filters.text)!);
            }
            const response = await fetch(url);
            const result = await response.json();
            return result;
        });

        this.items = new Computed(async (value, previousValue) => {
            const previousItems = new Map(((await previousValue) ?? []).map(i => [i.id, i]));
            const dataItems = await value(this.dataItems);
            return dataItems.map(i => {
                const item = previousItems.get(i.id);

                if (item) {
                    item.text.value = i.text;
                    item.done.value = i.done;
                    return item;
                }

                return new ItemEntity(i);
            });
        });

        this.counts = new Computed(async (value) => {
            const items = await value(this.items);

            const result = {
                done: 0,
                notDone: 0
            };

            for (const i of items) {
                if (value(i.done)) {
                    result.done++;
                } else {
                    result.notDone++;
                }
            }

            return result;
        });
    }
}

const query = new SampleQuery();

import { bindAwait } from 'async-reactivity-vue';
const items = bindAwait(query.items, []).data;
const counts = bindAwait(query.counts, { done: 0, notDone: 0 }).data;

const invalidate = () => {
    query.dataItems.forceInvalidate();
};

import Item from './Item.vue';
</script>