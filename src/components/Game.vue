<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import * as PuzzleResolver from '../libs/puzzle-resolver';
import { millisecondsToStr } from '../composables/helpers';
import { SCREEN_PADDING } from '../logic/constants';
import { buildBlockSpec, buildGameContainerSpec, buildInitData, buildResultMap, generateValidBlocksState } from '../logic/game';
import { Cell, GameConfig, GameMode, GameStatus, ImageModeConfig, MapSpec } from '../model/GameConfig';
import Block from './Block.vue';
import ZoomableImage from './ZoomableImage.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const {
    mode,
    mapSpec,
    image
} = defineProps<{
    mode: GameMode,
    image?: ImageModeConfig,
    mapSpec: MapSpec,
}>();

const config: GameConfig = {
    mode,
    image: image || {
        url: ''
    },
    mapSpec: mapSpec,
    blockSpec: {
        size: 120,
        gap: 12,
        borderRadius: 10
    },
    containerSpec: {
        width: 0,
        height: 0,
        backgroundWidth: 0,
        backgroundHeight: 0,
    }
};

onMounted(() => {
    if (route.query.auto_resolve) {
        PuzzleResolver.resolve();
    }
})

config.blockSpec = buildBlockSpec(config);
config.containerSpec = buildGameContainerSpec(config);

const results = buildResultMap(config.mapSpec);

const { requiredData, shuffeData } = buildInitData(config.mapSpec);

const { blocks, blockMaps } = generateValidBlocksState(results, requiredData, shuffeData);

const blankBlock = ref<Cell>(blocks.value[0]);

if (!blankBlock.value) {
    alert('Error when init game!');
    console.error('Missing blank block', blocks, blockMaps);
    throw new Error('Missing blank block');
}

const keyboardKeyToActions: Record<string, number[]> = {
    'ArrowUp': [-1, 0],
    'w': [-1, 0],
    'ArrowRight': [0, 1],
    'd': [0, 1],
    'ArrowDown': [1, 0],
    's': [1, 0],
    'ArrowLeft': [0, -1],
    'a': [0, -1],
};

const state = reactive<{
    status: GameStatus,
    moveCount: number,
    startedAt: number,
    completedAt: number,
}>({
    status: GameStatus.WAITING,
    moveCount: 0,
    startedAt: 0,
    completedAt: 0,
})

function moveBlankBlock([rowDelta, colDeta]: number[], increaseMove: number = 1) {
    if (state.status == GameStatus.WIN) {
        return;
    }

    if (state.status == GameStatus.WAITING) {
        state.startedAt = Date.now();
        state.status = GameStatus.PLAYING;
    }

    let oldRow = blankBlock.value.row;
    let oldCol = blankBlock.value.col;

    let newRow = oldRow + rowDelta;
    let newCol = oldCol + colDeta;

    if (!results[newRow] || results[newRow][newCol] === undefined || results[newRow][newCol] === -1) {
        return;
    }

    state.moveCount += increaseMove;

    let targetBlock = findBlock(newRow, newCol)!;
    targetBlock.col = oldCol;
    targetBlock.row = oldRow;
    blankBlock.value.row = newRow;
    blankBlock.value.col = newCol;

    if (isWin()) {
        setTimeout(() => {
            if (!route.query.disable_win_alert) {
                alert(`Win. Solve in ${millisecondsToStr(state.completedAt - state.startedAt)} with ${state.moveCount} moves`);
            }
            if (route.query.auto_reload) {
                location.reload();
            }
        }, 500);
        state.completedAt = Date.now();
        state.status = GameStatus.WIN;
    }
}

function handleClickBlock(cell: Cell) {
    if (cell.value <= 0) {
        return;
    }

    if (cell.col == blankBlock.value?.col) {
        const targetRow = cell.row;
        while (blankBlock.value.row != targetRow) {
            moveBlankBlock([targetRow > blankBlock.value.row ? 1 : -1, 0], 0);
        }
        state.moveCount++;
    } else if (cell.row == blankBlock.value?.row) {
        const targetCol = cell.col;
        while (blankBlock.value.col != targetCol) {
            moveBlankBlock([0, targetCol > blankBlock.value.col ? 1 : -1], 0);
        }
        state.moveCount++;
    }
}

function findBlock(row: number, col: number) {
    return blocks.value.find((it) => it.row == row && it.col == col)
}

function isWin() {
    return blocks.value.filter(it => it.value == results[it.row][it.col]).length == blocks.value.length
}

window.document.addEventListener('keydown', function handleKeypress(e: KeyboardEvent) {
    if (!keyboardKeyToActions[e.key]) {
        return;
    }
    moveBlankBlock(keyboardKeyToActions[e.key])
});

</script>

<template>
    <div class="game-container" :data-rows="config.mapSpec.gridRows" :data-cols="config.mapSpec.gridCols"
        :style="{width: `${config.containerSpec.width}px`, fontSize: `${config.blockSpec.size / 2}px`, marginTop: `${SCREEN_PADDING}px`}">
        <template v-for="rows in blockMaps">
            <template v-for="cell in rows">
                <Block @click="handleClickBlock(cell)" :cell="cell"
                    :is-correct="cell.value == results[cell.row][cell.col]" :size="config.blockSpec.size"
                    :gap="config.blockSpec.gap" :border-radius="config.blockSpec.borderRadius"
                    :background-url="config.image.url" :background-width="config.containerSpec.backgroundWidth"
                    :background-height="config.containerSpec.backgroundHeight" />
            </template>
        </template>

        <div style="position:absolute;text-align:right;font-weight: bold;display:flex;" :style="{
                right: `${config.blockSpec.gap}px`, top: `${config.blockSpec.gap}px`, fontSize: `${Math.min(24, config.blockSpec.size / 3)}px`
        }">
            <div v-if="config.mode == GameMode.IMAGE" style="margin-right: 15px;">
                <ZoomableImage :full-width="config.containerSpec.width" :full-height="config.containerSpec.height"
                    :width="config.blockSpec.size" :height="config.blockSpec.size" :image="config.image.url"
                    :placeholder="config.image.url" />
            </div>

            <div>
                <div>Moves</div>
                <div>{{ state.moveCount }}</div>
            </div>
        </div>
    </div>
</template>