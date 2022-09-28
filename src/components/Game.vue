<script setup lang="ts">
import { ref } from 'vue';
import { Cell } from '../model/Cell';
import Block from './Block.vue';

const PADDING = 15;
const M = 3;
const N = 5;
const GAP = M > 15 ? 6 : (M > 10 ? 8 : 12);

const maxWidth = (window.innerWidth - PADDING * 2 - (M + 1) * GAP) / M;
const maxHeight = (window.innerHeight - PADDING * 2 - (N + 2) * GAP) / (N + 1);
const WIDTH = Math.min(100, maxWidth, maxHeight);

let requiredData: number[] = [0, 1];
let shuffeData: number[] = [];
for (let i = 2; i <= M * N; i++) {
    shuffeData.push(i);
}

const blocks = ref<Cell[]>([...requiredData, ...shuffle(shuffeData)].map(value => {
    return {
        type: 'block',
        value: value,
        text: value?.toString(),
        row: 0,
        col: 0
    } as Cell
}));

const results = [
    [0, ...[new Array(M - 1)].map(() => -1)],
];

for (let i = 1; i <= N; i++) {
    let row = []
    for (let j = 1; j <= M; j++) {
        row.push((i - 1) * M + j);
    }
    results.push(row);
}

const blockMaps: Cell[][] = [];
let takenBlockIndex = 0;

const blankBlock = ref<Cell | null>(null);

for (let i = 0; i < results.length; i++) {
    let row = [];
    for (let j = 0; j < results[i].length; j++) {
        if (results[i][j] == -1) {
            row.push({ type: 'wall', value: -1, row: i, col: j } as Cell);
            continue;
        }
        let cell = blocks.value[takenBlockIndex++];
        cell.row = i;
        cell.col = j;

        if (cell.value == 0) {
            blankBlock.value = cell;
        }

        row.push(cell);
    }
    blockMaps.push(row);
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

window.document.addEventListener('keydown', function handleKeypress(e: KeyboardEvent) {
    if (!keyboardKeyToActions[e.key]) {
        return;
    }
    moveZeroBlock(keyboardKeyToActions[e.key])
});

const stepCount = ref<number>(0);
const GAME_STATUS = ref(0);

function moveZeroBlock([rowDelta, colDeta]: number[]) {
    if (GAME_STATUS.value == 200) {
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

    stepCount.value++;

    let targetBlock = findBlock(newRow, newCol)!;
    targetBlock.col = oldCol;
    targetBlock.row = oldRow;
    blankBlock.value.row = newRow;
    blankBlock.value.col = newCol;

    if (isWin()) {
        alert(`Win (${stepCount.value} steps)`);
        GAME_STATUS.value = 200;
    }
}

function handleClickBlock(cell: Cell) {
    if (cell.value <= 0) {
        return;
    }

    if (cell.col == blankBlock.value?.col) {
        const targetRow = cell.row;
        while (blankBlock.value.row != targetRow) {
            moveZeroBlock([targetRow > blankBlock.value.row ? 1 : -1, 0])
        }
    } else if (cell.row == blankBlock.value?.row) {
        const targetCol = cell.col;
        while (blankBlock.value.col != targetCol) {
            moveZeroBlock([0, targetCol > blankBlock.value.col ? 1 : -1])
        }
    }
}

function findBlock(row: number, col: number) {
    return blocks.value.find((it) => it.row == row && it.col == col)
}

function isWin() {
    return blocks.value.filter(it => it.value == results[it.row][it.col]).length == blocks.value.length
}

function shuffle(array: any[]) {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    let index = -1
    const lastIndex = length - 1
    const result = [...array]
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = result[rand]
        result[rand] = result[index]
        result[index] = value
    }
    return result
}

</script>

<template>
    <div class="game-container"
        :style="{width: `${M * (WIDTH + GAP) + GAP}px`, fontSize: `${2 / 4 * WIDTH}px`, marginTop: `${PADDING}px`}">
        <template v-for="rows in blockMaps">
            <template v-for="cell in rows">
                <Block @click="handleClickBlock(cell)" :cell="cell"
                    :is-correct="cell.value == results[cell.row][cell.col]" :width="WIDTH" :gap="GAP" />
            </template>
        </template>
    </div>
</template>