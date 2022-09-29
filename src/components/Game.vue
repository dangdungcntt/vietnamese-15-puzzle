<script setup lang="ts">
import { ref } from 'vue';
import { buildBlockSpec, buildGameContainerSpec, buildInitData, buildResultMap, generateValidBlocksState } from '../logic/game';
import { Cell } from '../model/Cell';
import Block from './Block.vue';
import ZoomableImage from './ZoomableImage.vue';

const PADDING = 15;
let GRID_COLS = 3;
let GRID_ROWS = 5;

const sizeParamsMatches = location.pathname.match(/^\/(\d{1,2})[x\/](\d{1,2})$/);
if (sizeParamsMatches) {
    GRID_ROWS = Math.min(Math.max(+sizeParamsMatches[1], 3), 15);
    GRID_COLS = Math.min(Math.max(+sizeParamsMatches[2], 3), 15);
}

const AVAILABLE_IMAGES: Record<string, number[]> = {
    'tranh-dong-ho': [5, 3],
    'ban-do-viet-nam': [4, 3],
    'iphone-14-pro-max': [6, 4],
    'phong-canh-1': [5, 6],
}

const modeImageMatches = location.pathname.match(/^\/mode\/image\/(.*)$/);
let imageName = modeImageMatches ? modeImageMatches[1] : '';

const useImageBackground = !!AVAILABLE_IMAGES[imageName];

const imageUrl = useImageBackground ? `/images/${imageName}.jpg` : '';

if (useImageBackground) {
    GRID_ROWS = AVAILABLE_IMAGES[imageName][0];
    GRID_COLS = AVAILABLE_IMAGES[imageName][1];
}

const {
    BLOCK_SIZE, GAP,
    BORDER_RADIUS,
    BACKGROUND_HEIGHT_SIZE,
    BACKGROUND_WIDTH_SIZE
} = buildBlockSpec({
    gridRows: GRID_ROWS,
    gridCols: GRID_COLS,
    containerPadding: PADDING,
    useImageBackground: useImageBackground
});

const { CONTAINER_HEIGHT, CONTAINER_WIDTH } = buildGameContainerSpec({
    gridRows: GRID_ROWS,
    gridCols: GRID_COLS,
    containerPadding: PADDING,
    blockSize: BLOCK_SIZE,
    gap: GAP
});

const results = buildResultMap({
    gridRows: GRID_ROWS,
    gridCols: GRID_COLS,
});

const { requiredData, shuffeData } = buildInitData({
    gridRows: GRID_ROWS,
    gridCols: GRID_COLS,
});

const { blocks, blockMaps } = generateValidBlocksState(results, requiredData, shuffeData);

const blankBlock = ref<Cell>(blocks.value[0]);

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

const moveCount = ref(0);

const GAME_STATUS = ref(0);
const GAME_STATUS_WIN = 200;

function moveBlankBlock([rowDelta, colDeta]: number[], increaseMove: number = 1) {
    if (GAME_STATUS.value == GAME_STATUS_WIN) {
        return;
    }

    if (!blankBlock.value) {
        alert('Error');
        return;
    }

    let oldRow = blankBlock.value.row;
    let oldCol = blankBlock.value.col;

    let newRow = oldRow + rowDelta;
    let newCol = oldCol + colDeta;

    if (!results[newRow] || results[newRow][newCol] === undefined || results[newRow][newCol] === -1) {
        return;
    }

    moveCount.value += increaseMove;

    let targetBlock = findBlock(newRow, newCol)!;
    targetBlock.col = oldCol;
    targetBlock.row = oldRow;
    blankBlock.value.row = newRow;
    blankBlock.value.col = newCol;

    if (isWin()) {
        setTimeout(() => {
            alert(`Win (${moveCount.value} moves)`);
        }, 250);
        GAME_STATUS.value = GAME_STATUS_WIN;
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
        moveCount.value++;
    } else if (cell.row == blankBlock.value?.row) {
        const targetCol = cell.col;
        while (blankBlock.value.col != targetCol) {
            moveBlankBlock([0, targetCol > blankBlock.value.col ? 1 : -1], 0);
        }
        moveCount.value++;
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
    <div class="game-container" :data-rows="GRID_ROWS" :data-cols="GRID_COLS"
        :style="{width: `${GRID_COLS * (BLOCK_SIZE + GAP) + GAP}px`, fontSize: `${BLOCK_SIZE / 2}px`, marginTop: `${PADDING}px`}">
        <template v-for="rows in blockMaps">
            <template v-for="cell in rows">
                <Block @click="handleClickBlock(cell)" :cell="cell"
                    :is-correct="cell.value == results[cell.row][cell.col]" :width="BLOCK_SIZE" :gap="GAP"
                    :border-radius="BORDER_RADIUS" :background-url="imageUrl"
                    :background-width-size="BACKGROUND_WIDTH_SIZE" :background-height-size="BACKGROUND_HEIGHT_SIZE" />
            </template>
        </template>

        <div style="position:absolute;text-align:right;font-weight: bold;display:flex;" :style="{
                right: `${GAP}px`, top: `${GAP}px`, fontSize: `${Math.min(24, BLOCK_SIZE / 3)}px`
        }">
            <div v-if="useImageBackground" style="margin-right: 15px;">
                <ZoomableImage :full-width="CONTAINER_WIDTH" :full-height="CONTAINER_HEIGHT" :width="BLOCK_SIZE"
                    :height="BLOCK_SIZE" :image="imageUrl" :placeholder="imageUrl" />
            </div>

            <div>
                <div>Moves</div>
                <div>{{ moveCount }}</div>
            </div>
        </div>
    </div>
</template>