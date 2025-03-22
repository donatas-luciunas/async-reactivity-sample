<template>
    <h2>HTTP</h2>
    <button @click="show = !show">{{ show ? 'Collapse' : 'Expand' }}</button>
    <button @click="invalidate()">Invalidate</button>
    <p v-if="show">b: {{ b }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const show = ref(false);

import { bindAwait } from 'async-reactivity-vue';
import * as query from './http.js';
const b = bindAwait(query.b, true).data;

const invalidate = () => {
    query.b.forceInvalidate();
};
</script>