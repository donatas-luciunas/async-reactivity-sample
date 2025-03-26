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
        <Item v-for="item of items" :key="item.id.value" :item="item" />
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

import { HttpSampleQuery } from '@async-reactivity-sample/business-logic';
const query = new HttpSampleQuery();

import { bindAwait } from 'async-reactivity-vue';
const items = bindAwait(query.items, []).data;

const invalidate = () => {
    query.dataItems.forceInvalidate();
};

import Item from './Item.vue';
</script>