<script setup lang="ts">
import { SCREEN_PADDING_TOP } from '../logic/constants';
</script>

<template>
    <div>
        <div :style="{maxHeight: `${SCREEN_PADDING_TOP}px`}"
            style="display:flex;justify-content:center;align-items:center;">
            <router-link to="/"
                style="padding: 15px 15px 10px;font-size: 1.5rem;cursor: pointer;text-decoration:none;color:#fff;"
                class="text-center font-logo">
                Puzzle Game
            </router-link>
        </div>
        <slot />
    </div>
</template>