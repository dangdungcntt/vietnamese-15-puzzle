<script setup lang="ts">
import { useRouter } from 'vue-router';
import Game from '../../components/Game.vue'
import { GameMode } from '../../model/GameConfig';
import { PICTURES, getImageUrl } from '../../logic/pictures';

const router = useRouter();
const { imageName } = defineProps<{ imageName: string }>();

const imageConfig = PICTURES[imageName];

if (!imageConfig) {
    router.push('/');
}

</script>
    
<template>
    <div>
        <Game v-if="imageConfig && getImageUrl(imageName)" :mode="GameMode.IMAGE"
            :image="{url: getImageUrl(imageName)!}" :map-spec="imageConfig" />
    </div>
</template>