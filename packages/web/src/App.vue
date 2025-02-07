<script setup lang="ts">
import { ref } from 'vue';
const show = ref(false);

import { bind } from 'async-reactivity-vue';
import * as state from './state';

const b = bind(state.b);
</script>

<template>
  <div>
    <button @click="show = !show">Toggle</button>
    <p v-if="show">Listener: {{ b }}</p>
  </div>
</template>