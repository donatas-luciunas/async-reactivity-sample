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
    query.filters.text.value = Promise.resolve(text.value.trim());
}, 500));

const doneFilter = ref(false);
const doneValue = ref(false);

watch([doneFilter, doneValue], ([filter, value]) => {
    query.filters.done.value = Promise.resolve(filter ? value : null);
});

const show = ref(false);

import { Connection } from 'async-reactivity-net';
import { SocketSampleLiveQuery } from '@async-reactivity-sample/business-logic';

const query = (() => {
    const socket = new WebSocket("ws://localhost:8080");
    const connection = new Connection(socket, [SocketSampleLiveQuery]);

    const query = new SocketSampleLiveQuery(connection);
    connection.add(query);
    
    return query;
})();

import { bindAwait } from 'async-reactivity-vue';
const items = bindAwait(query.items, []).data;
const counts = bindAwait(query.counts, { done: 0, notDone: 0 }).data;

import Item from './Item.vue';
</script>