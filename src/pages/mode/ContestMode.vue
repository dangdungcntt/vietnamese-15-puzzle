<script setup lang="ts">
import { GameMode } from '../../model/GameConfig';
import Game from '../../components/Game.vue'
import { MAP_SIZES } from '../../logic/mapSizes';

const { pin } = defineProps<{ pin: string }>();

const mapSpec = { gridRows: 5, gridCols: 3 };

let extractedPinValue = pin;

if (extractedPinValue && extractedPinValue.length > 6) {
    let mapIndex = parseInt(extractedPinValue.substring(0, extractedPinValue.length - 6))
    if (!isNaN(mapIndex) && MAP_SIZES[mapIndex]) {
        extractedPinValue = extractedPinValue.substring(extractedPinValue.length - 6);
        mapSpec.gridRows = MAP_SIZES[mapIndex].gridRows;
        mapSpec.gridCols = MAP_SIZES[mapIndex].gridCols;
    }
}

</script>

<template>
    <Game :mode="GameMode.CONTEST" :map-spec="mapSpec" :pin="pin" />
</template>