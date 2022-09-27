<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { Cell } from '../model/Cell';
import Block from './Block.vue';

const WIDTH = 100;
let requiredData: number[] = [0, 1];
let shuffeData: number[] = [];
for (let i = 2; i <= 15; i++) {
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

const wallMap = [
    [-1, -1, -1, -1, -1],
    [-1, 0, -1, -1, -1],
    [-1, 1, 2, 3, -1],
    [-1, 4, 5, 6, -1],
    [-1, 7, 8, 9, -1],
    [-1, 10, 11, 12, -1],
    [-1, 13, 14, 15, -1],
    [-1, -1, -1, -1, -1],
];

const result: Cell[][] = [];
let takeBlockIndex = 0;

const zeroBlock = ref<Cell | null>(null);

for (let i = 0; i < wallMap.length; i++) {
    let row = [];
    for (let j = 0; j < wallMap[i].length; j++) {
        if (wallMap[i][j] == -1) {
            row.push({ type: 'wall', value: -1, row: i, col: j, isBorderX: j == 0 || j == wallMap[i].length - 1, isBorderY: i == 0 || i == wallMap.length - 1 } as Cell);
            continue;
        }
        let cell = blocks.value[takeBlockIndex++];
        cell.row = i;
        cell.col = j;

        if (cell.value == 0) {
            zeroBlock.value = cell;
        }

        row.push(cell);
    }
    result.push(row);
}

const mapArrowKeys: Record<string, number[]> = {
    'ArrowUp': [-1, 0],
    'ArrowRight': [0, 1],
    'ArrowDown': [1, 0],
    'ArrowLeft': [0, -1],
};

window.document.addEventListener('keydown', function handleKeypress(e: KeyboardEvent) {
    console.log(e.key);

    if (!mapArrowKeys[e.key]) {
        return;
    }
    moveZeroBlock(mapArrowKeys[e.key])
});

const stepCount = ref<number>(0);

function moveZeroBlock([rowDelta, colDeta]: number[]) {
    if (!zeroBlock.value) {
        alert('Error');
        return;
    }

    let oldRow = zeroBlock.value.row;
    let oldCol = zeroBlock.value.col;

    let newRow = oldRow + rowDelta;
    let newCol = oldCol + colDeta;

    if (wallMap[newRow][newCol] === -1) {
        return;
    }

    stepCount.value++;

    let targetBlock = findBlock(newRow, newCol)!;
    targetBlock.col = oldCol;
    targetBlock.row = oldRow;
    zeroBlock.value.row = newRow;
    zeroBlock.value.col = newCol;

    nextTick(() => {
        if (isWin()) {
            alert(`Win (${stepCount.value} steps)`);
            location.reload();
        }
    })
}

function findBlock(row: number, col: number) {
    return blocks.value.find((it) => it.row == row && it.col == col)
}

function isWin() {
    return blocks.value.filter(it => it.value == wallMap[it.row][it.col]).length == blocks.value.length
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
    <div style="position:relative;margin:0 auto;background: #ccc;" :style="{width: `${wallMap[0].length * WIDTH}px`}">
        <template v-for="rows in result">
            <template v-for="cell in rows">
                <Block :cell="cell" :width="WIDTH" />
            </template>
        </template>
    </div>
</template>