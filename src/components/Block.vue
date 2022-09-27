<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { Cell } from '../model/Cell';

const { cell, width } = defineProps<{ width: number, cell: Cell }>();

const computedWidth = computed(() => cell.isBorderX ? width / 10 : width);
const computedHeight = computed(() => cell.isBorderY ? width / 10 : width);

</script>

<template>
    <div class="block" :style="{
        position: 'absolute', 
        left: `${cell.col == 0 ? (width - computedWidth) :cell.col * width}px`,
        top: `${cell.row == 0 ? (width - computedHeight) : cell.row * width}px`, 
        width: `${computedWidth}px`,
        height: `${computedHeight}px`,
        background: cell.type == 'wall' ? '#999' : (cell.value > 0 ? '#ffc65c' : '#fff')
    }" v-text="cell.value > 0 ? cell.text : ''">
    </div>
</template>