<script setup lang="ts">
import { ref, watch } from 'vue';
import Http from './Http.vue';
import Socket from './Socket.vue';

const input = ref(5);

const send = async () => {
  fetch('http://localhost:8080', {
    method: 'PUT',
    body: JSON.stringify({
      input: input.value
    })
  });
};

import * as query from './query.js';
const invert = ref(false);
watch(invert, (value) => {
  query.invert.value = value;
});
</script>

<template>
  <div>
    <h2>Input</h2>
    <p>
      <input type="number" v-model="input" />
      <button @click="send()">Send</button>
    </p>
    <h2>Query</h2>
    <label>
      <input type="checkbox" v-model="invert" />
      Invert
    </label>
    <Http />
    <Socket />
  </div>
</template>