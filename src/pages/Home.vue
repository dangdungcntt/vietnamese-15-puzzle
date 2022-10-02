<script setup lang="ts">
import { ref } from 'vue';
import { ActiveMenu } from '../model/GameMenu';

import HomeLayout from '../layouts/HomeLayout.vue';
import ListMapSize from '../components/ListMapSize.vue';

import { MAP_SIZES } from '../logic/mapSizes';

const activeMenu = ref(ActiveMenu.HOME);

function changeActiveMenu(newValue: ActiveMenu) {
    activeMenu.value = newValue;
}

</script>

<template>
    <HomeLayout>
        <div v-if="activeMenu == ActiveMenu.HOME">
            <router-link :to="{name: 'map-sizes'}" class="btn">Chế độ cổ điển</router-link>
            <router-link :to="{name: 'pictures'}" class="btn">Chế độ ghép hình</router-link>
            <a @click="changeActiveMenu(ActiveMenu.SELECT_MAP_FOR_CONTEST)" class="btn">Chế độ thi đấu</a>
            <router-link :to="{name: 'how-to-play'}" class="btn">Hướng dẫn</router-link>
        </div>

        <div v-if="activeMenu == ActiveMenu.SELECT_MAP_FOR_CONTEST">
            <h2 class="text-center">Danh sách bàn chơi</h2>

            <ListMapSize :map-sizes="MAP_SIZES" to-route-name="contest-generator-custom" />
        </div>

        <a v-if="activeMenu != ActiveMenu.HOME" @click="changeActiveMenu(ActiveMenu.HOME)" class="btn">Quay lại</a>
    </HomeLayout>
</template>