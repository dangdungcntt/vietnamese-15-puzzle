import { ref, toRaw } from "vue";
import { shuffle } from "../composables/helpers";
import { Cell } from "../model/Cell";

export function buildInitData({ gridCols, gridRows }: { gridCols: number, gridRows: number }) {
    const requiredData: number[] = [0, 1];
    const shuffeData: number[] = [];
    for (let i = 2; i <= gridCols * gridRows; i++) {
        shuffeData.push(i);
    }

    return { requiredData, shuffeData };
}

export function buildResultMap({ gridCols, gridRows }: { gridCols: number, gridRows: number }) {
    const results = [
        [0, ...[...Array(gridCols - 1)].map(() => -1)],
    ];

    for (let i = 1; i <= gridRows; i++) {
        let row = []
        for (let j = 1; j <= gridCols; j++) {
            row.push((i - 1) * gridCols + j);
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

export function buildGameContainerSpec({
    gridCols,
    gridRows,
    blockSize,
    gap,
    containerPadding,
}: {
    gridCols: number,
    gridRows: number,
    blockSize: number,
    gap: number,
    containerPadding: number,
}) {
    const CONTAINER_WIDTH = gridCols * (blockSize + gap) + gap;
    const CONTAINER_HEIGHT = (gridRows + 1) * (blockSize + gap) + gap;

    return { CONTAINER_HEIGHT, CONTAINER_WIDTH };
}

export function buildBlockSpec({
    gridCols,
    gridRows,
    containerPadding,
    useImageBackground
}: {
    gridCols: number,
    gridRows: number,
    containerPadding: number,
    useImageBackground: boolean
}) {
    const maxSize = Math.max(gridCols, gridRows);
    const GAP = useImageBackground ? 2 : (maxSize >= 12 ? 6 : (maxSize >= 8 ? 8 : 12));
    const BORDER_RADIUS = useImageBackground ? 2 : 10;

    const maxWidth = (window.innerWidth - containerPadding * 2 - (gridCols + 1) * GAP) / gridCols;
    const maxHeight = (window.innerHeight - containerPadding * 2 - (gridRows + 2) * GAP) / (gridRows + 1);
    const BLOCK_SIZE = Math.min(120, maxWidth, maxHeight);

    const BACKGROUND_WIDTH_SIZE = gridCols * BLOCK_SIZE + GAP * (gridCols - 1);
    const BACKGROUND_HEIGHT_SIZE = gridRows * BLOCK_SIZE + GAP * (gridRows - 1);

    return { BLOCK_SIZE, GAP, BORDER_RADIUS, BACKGROUND_HEIGHT_SIZE, BACKGROUND_WIDTH_SIZE };
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
            let [cX, cY] = convertValueToCorrectPosition(cell.value, {
                gridRows: results.length,
                gridCols: results[i].length
            })
            cell.correctRow = cX;
            cell.correctCol = cY;

            row.push(cell);
        }
        blockMaps.push(row);
    }

    return { blocks, blockMaps };
}

function convertValueToCorrectPosition(value: number, { gridCols, gridRows }: { gridCols: number, gridRows: number }) {
    return [
        value % gridCols == 0 ? value / gridCols : (Math.floor(value / gridCols) + 1),
        value % gridCols == 0 ? gridCols - 1 : (value % gridCols - 1)
    ];
}

function isSolvable(blockMaps: Cell[][]) {
    let parity = 0;
    const gridRows = blockMaps.length;
    const gridColumns = blockMaps[0].length;

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
        if (i % gridColumns == 0) {
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

    if (gridColumns % 2 != 0) {
        return parity % 2 == 0;
    }

    if (gridRows % 2 == 0) {
        return (parity + blankRow + 1) % 2 == 0;
    }

    return (parity + blankRow + 1) % 2 != 0;
}