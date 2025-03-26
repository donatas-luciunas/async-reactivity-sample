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

import { ref, onBeforeUnmount } from 'vue';
const text = ref('');
const done = ref(false);
const valid = ref(true);

import { Watcher } from 'async-reactivity';
const watchers = [
    new Watcher(props.item.text, async (value) => {
        text.value = await value;
    }),
    new Watcher(props.item.done, async (value) => {
        done.value = await value;
    }),
    new Watcher(props.item.valid, async (value) => {
        valid.value = await value;
    })
];

onBeforeUnmount(() => {
    for (const w of watchers) {
        w.dispose();
    }
});

const updateText = async () =>
    fetch(`http://localhost:8080/items/${props.item.id}?token=client-token`, {
        method: 'PATCH',
        body: JSON.stringify({
            text: text.value
        })
    });

const updateDone = async () =>
    fetch(`http://localhost:8080/items/${props.item.id}?token=client-token`, {
        method: 'PATCH',
        body: JSON.stringify({
            done: done.value
        })
    });

const remove = async () =>
    fetch(`http://localhost:8080/items/${props.item.id}?token=client-token`, {
        method: 'DELETE'
    });
</script>