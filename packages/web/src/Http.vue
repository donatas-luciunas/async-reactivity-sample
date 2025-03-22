<template>
    <h2>HTTP</h2>
    <button @click="show = !show">{{ show ? 'Collapse' : 'Expand' }}</button>
    <button @click="invalidate()">Invalidate</button>
    <p v-if="show">Listener: {{ b }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const show = ref(false);

import { bindAwait } from 'async-reactivity-vue';
import * as state from './httpState.js';
const b = bindAwait(state.b, true).data;

const invalidate = () => {
    state.b.forceInvalidate();
};
</script>