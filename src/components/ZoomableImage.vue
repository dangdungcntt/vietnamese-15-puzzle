<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const { placeholder, fullWidth, fullHeight, height, width } = defineProps<{
    image: string,
    placeholder: string,
    width: number,
    height: number,
    fullWidth: number,
    fullHeight: number,
}>();

const isZoomIn = ref<boolean>(false);

const style = computed(() => {
    if (isZoomIn.value) {
        return `width:${fullWidth}px;height:${fullHeight}px;transition: width 0.25s linear, height 0.25s linear;z-index: 11;position: fixed;left: 50%;transform: translate(-50%, 0);background:#000`
    }

    return `width:${width}px;height:${height}px;z-index: 11;padding:5px 5px 10px;`
})

function toggleZoomIn() {
    isZoomIn.value = !isZoomIn.value;
}

</script>
<template>
    <div @click="toggleZoomIn" style="position:relative;display:flex;flex-direction:column;cursor:pointer;"
        :style="style">
        <div
            :style="`flex-grow:1;background-position:center;background-repeat:no-repeat;background-size:contain;background-image:url(${placeholder})`">
        </div>
        <div style="padding:2% 0;text-align:center;background:#000;user-select:none;"
            :style="{fontSize: `${isZoomIn ? 12 : 10}px`}">
            Click to {{ isZoomIn ? 'close' : 'zoom'}}</div>
    </div>
</template>