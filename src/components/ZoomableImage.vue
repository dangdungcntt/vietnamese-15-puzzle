<script setup lang="ts">
defineProps<{ image: string, placeholder: string, height: number }>();
</script>
<template>
    <div style="padding:5px 5px 10px;position:relative;display:flex;flex-direction:column;"
        :style="{height: `${height}px`, width: `${height}px`}">
        <div style="flex-grow:1;background-position:center;background-repeat:no-repeat;background-size:contain;"
            :style="{backgroundImage: `url(${placeholder})`}"></div>

        <div style="padding:2% 0;font-size:10px;text-align:center;background:#000;height:16px;">
            Click to zoom</div>
    </div>
</template>