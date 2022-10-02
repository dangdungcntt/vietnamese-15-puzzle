<script setup lang="ts">
import { useMapSize } from '../../composables/mapSize';
import { GameMode } from '../../model/GameConfig';
import Game from '../../components/Game.vue'
import { useRouter } from 'vue-router';

const { mapSize } = defineProps<{ mapSize?: string, pin: string }>();

const { isValid, mapSpec } = useMapSize(mapSize, { gridRows: 5, gridCols: 3 });

if (mapSize && !isValid) {
    useRouter().push({ path: '/' });
}

</script>

<template>
    <Game :mode="GameMode.CONTEST" :map-spec="mapSpec" :pin="pin" />
</template>