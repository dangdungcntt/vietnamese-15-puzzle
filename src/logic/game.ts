import { ref, toRaw } from "vue";
import { shuffle } from "../composables/helpers";
import { Cell } from "../model/Cell";

export function buildInitData(gridWidth: number, gridHeight: number) {
    const requiredData: number[] = [0, 1];
    const shuffeData: number[] = [];
    for (let i = 2; i <= gridWidth * gridHeight; i++) {
        shuffeData.push(i);
    }

    return { requiredData, shuffeData };
}

export function buildResultMap(gridWidth: number, gridHeight: number) {
    const results = [
        [0, ...[...new Array(gridWidth - 1)].map(() => -1)],
    ];

    for (let i = 1; i <= gridHeight; i++) {
        let row = []
        for (let j = 1; j <= gridWidth; j++) {
            row.push((i - 1) * gridWidth + j);
        }
        results.push(row);
    }

    return results;
}

export function generateValidBlocksState(results: number[][], requiredData: number[], shuffeData: number[]) {
    let blocks = null;
    let blockMaps = null;

    do {
        let state = generateBlocksState(results, requiredData, shuffeData);
        blocks = state.blocks;
        blockMaps = state.blockMaps;
    } while (!isSolvable(blockMaps));

    return { blockMaps, blocks };

}

export function buildBlockSpec(gridWidth: number, gridHeight: number, containerPadding: number, useImageBackground: boolean) {
    const maxSize = Math.max(gridWidth, gridHeight);
    const GAP = useImageBackground ? 2 : (maxSize >= 12 ? 6 : (maxSize >= 8 ? 8 : 12));
    const BORDER_RADIUS = useImageBackground ? 2 : 10;

    const maxWidth = (window.innerWidth - containerPadding * 2 - (gridWidth + 1) * GAP) / gridWidth;
    const maxHeight = (window.innerHeight - containerPadding * 2 - (gridHeight + 2) * GAP) / (gridHeight + 1);
    const WIDTH = Math.min(120, maxWidth, maxHeight);

    const BACKGROUND_WIDTH_SIZE = gridWidth * WIDTH + GAP * (gridWidth - 1);
    const BACKGROUND_HEIGHT_SIZE = gridHeight * WIDTH + GAP * (gridHeight - 1);

    return { WIDTH, GAP, BORDER_RADIUS, BACKGROUND_HEIGHT_SIZE, BACKGROUND_WIDTH_SIZE };
}

function generateBlocksState(results: number[][], requiredData: number[], shuffeData: number[]) {
    const blocks = ref<Cell[]>([...requiredData, ...shuffle(shuffeData)].map(value => {
        return {
            type: 'block',
            value: value,
            text: value?.toString(),
            row: 0,
            col: 0
        } as Cell
    }));

    const blockMaps: Cell[][] = [];
    let takenBlockIndex = 0;

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
            let [cX, cY] = convertValueToCorrectPosition(cell.value, results[i].length, results.length)
            cell.correctRow = cX;
            cell.correctCol = cY;

            row.push(cell);
        }
        blockMaps.push(row);
    }

    return { blocks, blockMaps };
}

function convertValueToCorrectPosition(value: number, gridWidth: number, gridHeight: number) {
    return [value % gridWidth == 0 ? value / gridWidth : (Math.floor(value / gridWidth) + 1), value % gridWidth == 0 ? gridWidth - 1 : (value % gridWidth - 1)]
}

function isSolvable(blockMaps: Cell[][]) {
    let parity = 0;
    const gridRow = blockMaps.length;
    const gridColumn = blockMaps[0].length;

    let row = 0;
    let blankRow = 0;

    const puzzle = [];
    const cellOnlyBlockMaps = blockMaps.slice(1);

    cellOnlyBlockMaps[0][0].value = 0;

    for (let row of cellOnlyBlockMaps) {
        for (let cell of row) {
            puzzle.unshift(cell);
        }
    }

    for (let i = 0; i < puzzle.length; i++) {
        if (i % gridColumn == 0) {
            // advance to next row
            row++;
        }
        if (puzzle[i].value == 0) {
            blankRow = row;
            continue;
        }
        for (let j = i + 1; j < puzzle.length; j++) {
            if (puzzle[i].value < puzzle[j].value && puzzle[j].value != 0) {
                parity++;
            }
        }
    }

    cellOnlyBlockMaps[0][0].value = 1;

    if (gridColumn % 2 != 0) {
        return parity % 2 == 0;
    }

    if (gridRow % 2 == 0) {
        return (parity + blankRow + 1) % 2 == 0;
    }

    return (parity + blankRow + 1) % 2 != 0;
}