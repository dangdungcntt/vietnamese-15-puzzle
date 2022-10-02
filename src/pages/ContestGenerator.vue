<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMapSize } from '../composables/mapSize';
import { createRandom } from '../libs/seed-random';
import { LIMIT_GENERATE_TIMES } from '../logic/constants';
import { buildResultMap, buildInitData, generateBlocksState, isSolvable } from '../logic/game';
import Cell from '../model/Cell';
import Logo from '../components/Logo.vue';

import { MAP_SIZES } from '../logic/mapSizes';

const router = useRouter();

const { mapSize } = defineProps<{ mapSize?: string }>();

const { isValid, mapSpec } = useMapSize(mapSize, { gridRows: 5, gridCols: 3 });

const resultsMap = buildResultMap(mapSpec);
const { requiredData, shuffeData } = buildInitData(mapSpec);

const message = ref('Loading..');

const generatedPin = ref('');

onMounted(async () => {
    if (!isValid) {
        router.push({ path: '/' });
        console.log('Invalid mapSize');
        return;
    }

    let times = 0;
    let pin = nextPin(0);

    while (times < LIMIT_GENERATE_TIMES) {
        let state = generateBlocksState(resultsMap, requiredData, shuffeData, createRandom(pin.toString()));

        if (await asyncCheck(state.blockMaps)) {
            for (let i = 0; i < MAP_SIZES.length; i++) {
                if (MAP_SIZES[i].gridRows === mapSpec.gridRows && MAP_SIZES[i].gridCols === mapSpec.gridCols) {
                    generatedPin.value = `${i.toString().padStart(2, '0')}${pin}`;
                    return
                }
            }

            generatedPin.value = pin.toString()
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
    <div class="home-container">
        <Logo />

        <div class="text-center" v-if="generatedPin">
            Game PIN cho bàn chơi {{ `${mapSpec.gridRows}x${mapSpec.gridCols}` }} của bạn là:
            <h1 class="font-logo">{{ generatedPin }}</h1>

            <router-link :to="{name: 'contest-play', params: {pin: generatedPin}}" class="btn btn-primary"
                style="margin-top:2rem;">
                Chơi ngay</router-link>
        </div>
        <div v-else>{{ message }}</div>

        <router-link :to="{name: 'contest-map-sizes'}" class="btn" style="margin-top:1rem;">Quay lại
        </router-link>
    </div>
</template>