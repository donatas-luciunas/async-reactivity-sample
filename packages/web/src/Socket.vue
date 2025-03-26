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
        <button style="margin-left: 10px;" @click="dispose()">Dispose</button>
    </div>
    <div v-if="show">
        <Item v-for="item of items" :key="item.id.value" :item="item" />
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';

const text = ref('');
watch(text, debounce(() => {
    query.filters.text.value = Promise.resolve(text.value);
}, 500));

const doneFilter = ref(false);
const doneValue = ref(false);

watch([doneFilter, doneValue], ([filter, value]) => {
    query.filters.done.value = Promise.resolve(filter ? value : null);
});

const show = ref(false);

import { query } from './socket.js';

import { bindAwait } from 'async-reactivity-vue';
const items = bindAwait(query.items, []).data;

const dispose = () => {
    query.items.dispose();
};

import Item from './Item.vue';
</script>