<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMapSize } from '../../composables/mapSize';
import { GameMode } from '../../model/GameConfig';
import Game from '../../components/Game.vue'
import GameLayout from '../../layouts/GameLayout.vue';

const { mapSize } = defineProps<{ mapSize?: string }>();

const { isValid, mapSpec } = useMapSize(mapSize, { gridRows: 5, gridCols: 3 });

if (!isValid) {
    useRouter().push({ path: '/' });
}

</script>

<template>
    <GameLayout>
        <Game :mode="GameMode.CLASSIC" :map-spec="mapSpec" />
    </GameLayout>
</template>