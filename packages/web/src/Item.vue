<template>
    <div>
        <p>
            <input v-model="props.item.text.value" />
            <label style="margin-left: 10px">
                Done
                <input type="checkbox" v-model="props.item.done.value" />
            </label>
            <button disabled style="margin-left: 10px">Remove</button>
        </p>
        <p v-if="!props.item.valid.value" style="color: red">Missing text</p>
    </div>
</template>

<script lang="ts" setup>
import { Item } from '@async-reactivity-sample/business-logic';

const props = defineProps<{
    item: Item
}>();
</script>