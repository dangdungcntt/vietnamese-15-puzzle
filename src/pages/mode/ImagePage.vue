<script setup lang="ts">
import { useRouter } from 'vue-router';
import Game from '../../components/Game.vue'
import { GameMode, MapSpec } from '../../model/GameConfig';

const router = useRouter();
const { imageName } = defineProps<{ imageName: string }>();

const AVAILABLE_IMAGES: Record<string, MapSpec & { url?: string }> = {
    'tranh-dong-ho': {
        gridRows: 5,
        gridCols: 3,
    },
    'ban-do-viet-nam': {
        gridRows: 4,
        gridCols: 3,
    },
    'iphone-14-pro-max': {
        gridRows: 6,
        gridCols: 4,
    },
    'phong-canh-1': {
        gridRows: 5,
        gridCols: 6,
    },
    'phong-canh-2': {
        gridRows: 5,
        gridCols: 3,
    },
    'phong-canh-3': {
        gridRows: 4,
        gridCols: 4,
    },
};

const imageConfig = AVAILABLE_IMAGES[imageName];

if (!imageConfig) {
    router.push('/');
}

</script>
    
<template>
    <div>
        <Game v-if="imageConfig" :mode="GameMode.IMAGE"
            :image="{url: (imageConfig.url || `/images/${imageName}.jpg`).toString()}" :map-spec="imageConfig" />
    </div>
</template>