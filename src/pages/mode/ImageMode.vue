<script setup lang="ts">
import { useRouter } from 'vue-router';
import Game from '../../components/Game.vue'
import { GameMode, MapSpec } from '../../model/GameConfig';
import { PICTURES } from '../../logic/pictures';

const router = useRouter();
const { imageName } = defineProps<{ imageName: string }>();

const AVAILABLE_IMAGES: Record<string, MapSpec & { url?: string }> = PICTURES;

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