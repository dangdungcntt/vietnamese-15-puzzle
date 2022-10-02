<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';

import { MAP_SIZES } from '../logic/mapSizes';
import ListMapSize from '../components/ListMapSize.vue';
</script>
    
<template>
    <HomeLayout>
        <Logo />

        <h2 class="text-center">Danh sách bàn chơi</h2>

        <ListMapSize :map-sizes="MAP_SIZES" to-route-name="classic-mode-custom" />

        <router-link to="/" class="btn">Quay lại</router-link>
    </HomeLayout>
</template>