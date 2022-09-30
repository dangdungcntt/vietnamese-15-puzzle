<script setup lang="ts">
import Game from '../components/Game.vue'
import { GameMode, MapSpec } from '../model/GameConfig';

const { mapSize } = defineProps<{ mapSize?: string }>();

const mapSpec: MapSpec = { gridRows: 5, gridCols: 3 };

if (mapSize) {
    const mapSizeParamsMatches = mapSize.match(/^(\d{1,2})[x\/](\d{1,2})$/);
    if (mapSizeParamsMatches) {
        mapSpec.gridRows = Math.min(Math.max(+mapSizeParamsMatches[1], 3), 15);
        mapSpec.gridCols = Math.min(Math.max(+mapSizeParamsMatches[2], 3), 15);
    }
}
</script>

<template>
    <Game :mode="GameMode.CLASSIC" :map-spec="mapSpec" />
</template>