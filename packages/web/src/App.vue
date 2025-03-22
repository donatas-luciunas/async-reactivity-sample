<script setup lang="ts">
import { ref } from 'vue';
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
</script>

<template>
  <div>
    <h2>Input</h2>
    <p>
      <input type="number" v-model="input" />
      <button @click="send()">Send</button>
    </p>
    <Http />
    <Socket />
  </div>
</template>