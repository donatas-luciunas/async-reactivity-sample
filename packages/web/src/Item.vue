<template>
    <div style="margin: 10px 0;">
        <input v-model="text" @blur="updateText()" />
        <label style="margin-left: 10px">
            Done
            <input type="checkbox" v-model="done" @change="updateDone()" />
        </label>
        <button @click="remove()" style="margin-left: 10px">Remove</button>
        <span v-if="!valid" style="color: red; margin-left: 10px">Missing text</span>
    </div>
</template>

<script lang="ts" setup>
import { Item } from '@async-reactivity-sample/business-logic';
const props = defineProps<{
    item: Item
}>();

import { ref } from 'vue';
import { Watcher } from 'async-reactivity';
const text = ref('');
new Watcher(props.item.text, (value) => {
    text.value = value;
});

const done = ref(false);
new Watcher(props.item.done, (value) => {
    done.value = value;
});

const valid = ref(true);
new Watcher(props.item.valid, (value) => {
    valid.value = value;
});

const updateText = async () =>
    fetch(`http://localhost:8080/items/${props.item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            text: text.value
        })
    });

const updateDone = async () =>
    fetch(`http://localhost:8080/items/${props.item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            done: done.value
        })
    });

const remove = async () =>
    fetch(`http://localhost:8080/items/${props.item.id}`, {
        method: 'DELETE'
    });
</script>