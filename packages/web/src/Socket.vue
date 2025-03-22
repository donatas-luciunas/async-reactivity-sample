<template>
    <h2>Socket</h2>
    <button @click="show = !show">{{ show ? 'Collapse' : 'Expand' }}</button>
    <p v-if="show">b: {{ b }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const show = ref(false);

import { bindAwait } from 'async-reactivity-vue';
import * as query from './socket.js';
const b = bindAwait(query.b, true).data;
</script>