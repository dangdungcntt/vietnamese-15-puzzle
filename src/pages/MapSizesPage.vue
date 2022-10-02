<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';

import { MAP_SIZES } from '../logic/mapSizes';
import ListMapSize from '../components/ListMapSize.vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();

const toRouteName = ref('classic-mode-custom');

if (route.query.mode == 'contest') {
    toRouteName.value = 'contest-generator-custom';
}

</script>
    
<template>
    <HomeLayout>
        <Logo />

        <h2 class="text-center">Danh sách bàn chơi</h2>

        <ListMapSize :map-sizes="MAP_SIZES" :to-route-name="toRouteName" />

        <router-link to="/" class="btn">Quay lại</router-link>
    </HomeLayout>
</template>