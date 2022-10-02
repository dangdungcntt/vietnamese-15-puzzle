<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';

import { MAP_SIZES } from '../logic/mapSizes';
import ListMapSize from '../components/ListMapSize.vue';
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import router from '../router';

const enteredPin = ref('');

const isValidPin = computed(() => enteredPin.value && enteredPin.value.match(/^[0-9]{6,8}$/));

function handlePlayClick() {
    if (!isValidPin.value) {
        return;
    }

    router.push({ name: 'contest-play', params: { pin: enteredPin.value } })
}
</script>
    
<template>
    <HomeLayout>
        <h2 class="text-center">Nhập Game PIN</h2>

        <div class="text-center" style="margin-bottom: 1rem;">
            <input type="text" v-model="enteredPin" placeholder="Nhập Game PIN (6-8 số)">
        </div>

        <button @click="handlePlayClick" class="btn btn-primary" :disabled="!isValidPin">Chơi</button>

        <div class="text-center" style="opacity:0.6;margin-top:.5rem;"><small>Hoặc</small></div>

        <h2 class="text-center">Tạo bàn chơi mới</h2>

        <ListMapSize :map-sizes="MAP_SIZES" to-route-name="contest-generator-custom" />

        <router-link to="/" class="btn">Quay lại</router-link>
    </HomeLayout>
</template>

<style scoped>
a:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

input {
    width: 100%;
    background-color: rgb(255, 255, 255);
    border-color: rgba(57, 78, 106, 0.2);
    border-radius: 10px;
    border-width: 1px;
    flex-shrink: 1;
    font-size: 1rem;
    height: 3rem;
    line-height: 2;
    line-height: 1.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    transition-duration: .2s;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.input:focus {
    outline: 2px solid hsla((214 30% 32%)/.2);
    outline-offset: 2px;
}
</style>