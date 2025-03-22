<template>
    <h2>Socket</h2>
    <button @click="show = !show">{{ show ? 'Collapse' : 'Expand' }}</button>
    <p v-if="show">Listener: {{ b }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const show = ref(false);

import { bind } from 'async-reactivity-vue';
import * as state from './socketState';
const b = bind(state.b);
</script>