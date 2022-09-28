<script setup lang="ts">
import { Cell } from '../model/Cell';

const { cell, backgroundUrl } = defineProps<{
    width: number,
    gap: number,
    cell: Cell,
    isCorrect: boolean,
    borderRadius: number,
    backgroundUrl?: string,
    backgroundWidthSize?: number
    backgroundHeightSize?: number
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
        left: `${cell.col * width + gap * (cell.col + 1)}px`,
        top: `${cell.row * width + gap * (cell.row + 1)}px`, 
        width: `${width}px`,
        height: `${width}px`,
        borderRadius: `${borderRadius}px`,
        backgroundRepeat: 'no-repeat',
        backgroundImage: isBlockItem && backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: isBlockItem && backgroundWidthSize ? `${backgroundWidthSize}px ${backgroundHeightSize}px`: undefined,
        backgroundPositionX: `-${cell.correctCol * width + cell.correctCol * gap}px`,
        backgroundPositionY: `-${(cell.correctRow - 1) * width + gap * (cell.correctRow - 1)}px`, 
    }" @click="$emit('click')">
        <span v-if="isBlockItem && !isUseImage">{{ cell.text }}</span>
    </div>
</template>