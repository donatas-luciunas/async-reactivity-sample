<template>
    <div style="margin: 10px 0;">
        <input v-model="props.item.text.value" @blur="updateText()" />
        <label style="margin-left: 10px">
            Done
            <input type="checkbox" v-model="props.item.done.value" @change="updateDone()" />
        </label>
        <button @click="remove()" style="margin-left: 10px">Remove</button>
        <span v-if="!props.item.valid.value" style="color: red; margin-left: 10px">Missing text</span>
    </div>
</template>

<script lang="ts" setup>
import { Item } from '@async-reactivity-sample/business-logic';

const props = defineProps<{
    item: Item
}>();

const updateText = async () => {
    await fetch(`http://localhost:8080/items/${props.item.id.value}`, {
        method: 'PATCH',
        body: JSON.stringify({
            text: props.item.text.value
        })
    });
};

const updateDone = async () => {
    await fetch(`http://localhost:8080/items/${props.item.id.value}`, {
        method: 'PATCH',
        body: JSON.stringify({
            done: props.item.done.value
        })
    });
};

const remove = async () => {
    await fetch(`http://localhost:8080/items/${props.item.id.value}`, {
        method: 'DELETE'
    });
};
</script>