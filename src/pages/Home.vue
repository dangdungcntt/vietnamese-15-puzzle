<script setup lang="ts">
import { useRouter } from 'vue-router';
import Game from '../components/Game.vue'
import { useMapSize } from '../composables/mapSize';
import { GameMode } from '../model/GameConfig';

const { mapSize } = defineProps<{ mapSize?: string }>();

const { isValid, mapSpec } = useMapSize(mapSize, { gridRows: 5, gridCols: 3 });

if (!isValid) {
    useRouter().push({ path: '/' });
}

</script>

<template>
    <Game :mode="GameMode.CLASSIC" :map-spec="mapSpec" />
</template>