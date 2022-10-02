<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';

import { PICTURES } from '../logic/pictures';

</script>
    
<template>
    <HomeLayout>
        <Logo />

        <h2 class="text-center">Danh sách hình ảnh</h2>

        <router-link v-for="(_, imageName) in PICTURES" :key="imageName"
            :to="{name: 'image-mode', params: {imageName:imageName }}" class="btn"
            style="display:flex;justify-content: space-between;">
            <span>{{ _.name }}</span> <span>{{ _.gridRows }}x{{ _.gridCols }}</span>
        </router-link>

        <router-link to="/" class="btn" style="margin-top:1rem;">Quay lại</router-link>
    </HomeLayout>
</template>