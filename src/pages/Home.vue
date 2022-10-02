<script setup lang="ts">
import HomeLayout from '../layouts/HomeLayout.vue';

</script>

<template>
    <HomeLayout>
        <router-link :to="{name: 'map-sizes'}" class="btn">Chế độ cổ điển</router-link>
        <router-link :to="{name: 'pictures'}" class="btn">Chế độ ghép hình</router-link>
        <router-link :to="{name: 'contest-map-sizes'}" class="btn">Chế độ thi đấu</router-link>
        <router-link :to="{name: 'how-to-play'}" class="btn">Hướng dẫn</router-link>
    </HomeLayout>
</template>