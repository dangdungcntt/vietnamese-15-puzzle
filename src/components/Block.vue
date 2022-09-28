<script setup lang="ts">
import { Cell } from '../model/Cell';

defineProps<{
    width: number,
    gap: number,
    cell: Cell,
    isCorrect: boolean
}>();

defineEmits(['click']);

</script>

<template>
    <div class="block" :class="{
        'wall': cell.type == 'wall',
        'block-item': cell.value > 0,
        'correct-position': cell.value > 0 && isCorrect,
        'block-blank': cell.value === 0
    }" :style="{
        position: 'absolute', 
        left: `${cell.col * width + gap * (cell.col + 1)}px`,
        top: `${cell.row * width + gap * (cell.row + 1)}px`, 
        width: `${width}px`,
        height: `${width}px`,
    }" @click="$emit('click')">
        <span v-if="cell.value > 0">{{ cell.text }}</span>
    </div>
</template>