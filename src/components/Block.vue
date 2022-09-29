<script setup lang="ts">
import { Cell } from '../model/Cell';

const { cell, backgroundUrl } = defineProps<{
    size: number,
    gap: number,
    cell: Cell,
    isCorrect: boolean,
    borderRadius: number,
    backgroundUrl?: string,
    backgroundWidth?: number
    backgroundHeight?: number
}>();

defineEmits(['click']);

const isBlockItem = cell.value > 0;
const isUseImage = !!backgroundUrl

</script>

<template>
    <div class="block" :class="{
        'wall': cell.type == 'wall',
        'block-item': isBlockItem,
        'correct-position': isBlockItem && isCorrect,
        'block-blank': cell.value === 0
    }" :style="{
        position: 'absolute', 
        left: `${cell.col * size + (cell.col + 1) * gap}px`,
        top: `${cell.row * size + (cell.row + 1) * gap}px`, 
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
        backgroundRepeat: 'no-repeat',
        backgroundImage: isBlockItem && backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: isBlockItem && backgroundWidth ? `${backgroundWidth}px ${backgroundHeight}px`: undefined,
        backgroundPositionX: `-${cell.correctCol * size + cell.correctCol * gap}px`,
        backgroundPositionY: `-${(cell.correctRow - 1) * size + (cell.correctRow - 1) * gap}px`, 
    }" @click="$emit('click')" :data-value="cell.value">
        <span v-if="isBlockItem && !isUseImage">{{ cell.text }}</span>
    </div>
</template>