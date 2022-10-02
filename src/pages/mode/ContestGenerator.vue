<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMapSize } from '../../composables/mapSize';
import { createRandom } from '../../libs/seed-random';
import { LIMIT_GENERATE_TIMES } from '../../logic/constants';
import { buildResultMap, generateBlocksState, buildInitData, isSolvable } from '../../logic/game';
import Cell from '../../model/Cell';

const router = useRouter();

const { mapSize } = defineProps<{ mapSize?: string }>();

const { isValid, mapSpec } = useMapSize(mapSize, { gridRows: 5, gridCols: 3 });

const resultsMap = buildResultMap(mapSpec);
const { requiredData, shuffeData } = buildInitData(mapSpec);

const message = ref('Loading..');

onMounted(async () => {
    if (mapSize && !isValid) {
        router.push({ path: '/' });
        console.log('Invalid mapSize');
        return;
    }

    let times = 0;
    let pin = nextPin(0);

    while (times < LIMIT_GENERATE_TIMES) {
        let state = generateBlocksState(resultsMap, requiredData, shuffeData, createRandom(pin.toString()));

        if (await asyncCheck(state.blockMaps)) {
            message.value = 'Redirecting..';
            if (mapSize) {
                router.push({ name: 'contest-play-custom', params: { pin, mapSize } });
            } else {
                router.push({ name: 'contest-play', params: { pin } });
            }
            return;
        }
        pin = nextPin(pin);

        times++;
    }

    message.value = 'Cannot create new contest, please try again later.'
});

async function asyncCheck(blockMaps: Cell[][]) {
    return Promise.resolve(isSolvable(blockMaps));
}

function nextPin(currentPin: number): number {
    if (!currentPin) {
        return Math.floor(Math.random() * 900000 + 100000);
    }

    currentPin++;

    if (currentPin > 9999999) {
        return nextPin(0);
    }

    return currentPin;
}

</script>

<template>
    <div>{{ message }}</div>
</template>