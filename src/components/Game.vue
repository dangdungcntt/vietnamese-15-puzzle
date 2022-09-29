<script setup lang="ts">
import { reactive, ref } from 'vue';
import { millisecondsToStr } from '../composables/helpers';
import { SCREEN_PADDING, MODE_CLASSIC, MODE_IMAGE, STATUS_PLAYING, STATUS_WAITING, STATUS_WIN } from '../logic/constants';
import { buildBlockSpec, buildGameContainerSpec, buildInitData, buildResultMap, generateValidBlocksState } from '../logic/game';
import { Cell } from '../model/Cell';
import Block from './Block.vue';
import ZoomableImage from './ZoomableImage.vue';

const config = {
    mode: MODE_CLASSIC,
    image: {
        url: ''
    },
    mapSpec: {
        gridRows: 5,
        gridCols: 3,
    },
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

const mapSizeParamsMatches = location.pathname.match(/^\/(\d{1,2})[x\/](\d{1,2})$/);
if (mapSizeParamsMatches) {
    config.mapSpec.gridRows = Math.min(Math.max(+mapSizeParamsMatches[1], 3), 15);
    config.mapSpec.gridCols = Math.min(Math.max(+mapSizeParamsMatches[2], 3), 15);
}

const AVAILABLE_IMAGES: Record<string, number[]> = {
    'tranh-dong-ho': [5, 3],
    'ban-do-viet-nam': [4, 3],
    'iphone-14-pro-max': [6, 4],
    'phong-canh-1': [5, 6],
}

const modeImageMatches = location.pathname.match(/^\/mode\/image\/(.*)$/);
let imageName = modeImageMatches ? modeImageMatches[1] : '';

if (AVAILABLE_IMAGES[imageName]) {
    config.mode = MODE_IMAGE;
}

if (config.mode == MODE_IMAGE) {
    config.image.url = `/images/${imageName}.jpg`;
    config.mapSpec.gridRows = AVAILABLE_IMAGES[imageName][0];
    config.mapSpec.gridCols = AVAILABLE_IMAGES[imageName][1];
}

config.blockSpec = buildBlockSpec(config.mode, config.mapSpec);

config.containerSpec = buildGameContainerSpec(config.blockSpec, config.mapSpec);

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

const state = reactive({
    status: STATUS_WAITING,
    moveCount: 0,
    startedAt: 0,
    completedAt: 0,
})

function moveBlankBlock([rowDelta, colDeta]: number[], increaseMove: number = 1) {
    if (state.status == STATUS_WIN) {
        return;
    }

    if (state.status == STATUS_WAITING) {
        state.startedAt = Date.now();
        state.status = STATUS_PLAYING;
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
            alert(`Win. Solve in ${millisecondsToStr(state.completedAt - state.startedAt)} with ${state.moveCount} moves`);
        }, 250);
        state.completedAt = Date.now();
        state.status = STATUS_WIN;
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
            <div v-if="config.mode == MODE_IMAGE" style="margin-right: 15px;">
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