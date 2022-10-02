let status = 0;

if (!document.getElementById('puzzle-resolver-style') && location.href.includes('auto_resolve_hightlight=1')) {
    const style = document.createElement('style');
    style.id = 'puzzle-resolver-style';
    style.innerText = `.puzzle-resolver-target {background-color:#5daef4!important}`;
    document.head.appendChild(style);
}

export async function resolve(delay: string | undefined) {
    if (status == 1) {
        //Stop
        console.log('Stopped. An error will throw soon.')
        status = 0;
        return;
    }
    status = 1;
    const DELAY = isNaN(Number(delay)) ? 500 : Number(delay);
    const SAME_COLS = [Position.TOP, Position.NEXT_TO_TOP, Position.CENTER, Position.NEXT_TO_BOTTOM, Position.BOTTOM];
    const SAME_ROWS = [Position.LEFT, Position.NEXT_TO_LEFT, Position.CENTER, Position.NEXT_TO_RIGHT, Position.RIGHT];
    const LEFT_SIDES = [Position.TOP_LEFT, Position.NEXT_TO_LEFT, Position.LEFT, Position.BOTTOM_LEFT];
    const RIGHT_SIDES = [Position.TOP_RIGHT, Position.NEXT_TO_RIGHT, Position.RIGHT, Position.BOTTOM_RIGHT];
    const TOP_SIDES = [Position.TOP_LEFT, Position.NEXT_TO_TOP, Position.TOP, Position.TOP_RIGHT];
    const BOTTOM_SIDES = [Position.BOTTOM_LEFT, Position.NEXT_TO_BOTTOM, Position.BOTTOM, Position.BOTTOM_RIGHT];

    const gameContainer: HTMLDivElement = document.querySelector('.game-container')!;
    const gameConfig = new GameConfig(
        parseInt(gameContainer.dataset['rows']!) + 1,
        parseInt(gameContainer.dataset['cols']!)
    );

    const map = initBlankMap(gameConfig);

    const blocks = Array.from(document.querySelectorAll('.block:not(.wall)'))
        .map(it => BlockWrapper.fromEl(it));

    blocks.forEach(it => {
        const [correctRow, correctCol] = convertValueToCorrectPosition(it.value, gameConfig.cols);
        it.setCorrectPosition(correctRow, correctCol);
        map[it.row][it.col] = it;
    });

    if (blocks.filter(it => !it.isCorrect).length == 0) {
        console.log('All block is correct. Stop.');
        status = 0;
        return;
    }

    let start = Date.now();
    console.clear();
    console.log('Resolving...');

    const blankBlock = blocks.find(el => el.value == 0)!;

    let processingBlock: BlockWrapper | null = null;
    let ignoredBlock: Record<string, boolean> = {};

    for (let i = gameConfig.rows - 1; i > 2; i--) {
        for (let j = gameConfig.cols - 1; j >= 2; j--) {
            const block = blocks.find(it => it.correctRow == i && it.correctCol == j)!;
            console.log(`Moving ${block.value} to ${[block.correctRow, block.correctCol]}`);
            await moveBlockToPosition(block, [block.correctRow, block.correctCol]);
            block.markFrezee();
        }

        const fisrtBlock = blocks.find(it => it.correctRow == i && it.correctCol == 0)!;
        const secondBlock = blocks.find(it => it.correctRow == i && it.correctCol == 1)!;

        if (fisrtBlock.isCorrect && secondBlock.isCorrect) {
            continue;
        }

        await moveBlockToPosition(fisrtBlock, [secondBlock.correctRow, secondBlock.correctCol]);
        fisrtBlock.markFrezee();

        let success = await moveBlockToPosition(secondBlock, [secondBlock.correctRow - 1, secondBlock.correctCol]);
        if (!success) {
            fisrtBlock.unFrezee();

            await moveBlockToPosition(secondBlock, [secondBlock.correctRow - 2, secondBlock.correctCol]);
            secondBlock.markFrezee();

            await moveBlockToPosition(fisrtBlock, [secondBlock.correctRow, secondBlock.correctCol]);
            fisrtBlock.markFrezee();

            secondBlock.unFrezee();
            await moveBlockToPosition(secondBlock, [secondBlock.correctRow - 1, secondBlock.correctCol]);
        }

        secondBlock.markFrezee();
        fisrtBlock.unFrezee();

        await moveBlockToPosition(fisrtBlock, [fisrtBlock.correctRow, fisrtBlock.correctCol]);
        fisrtBlock.markFrezee();
        secondBlock.unFrezee();

        await moveBlockToPosition(secondBlock, [secondBlock.correctRow, secondBlock.correctCol]);
        secondBlock.markFrezee();
    }

    for (let j = gameConfig.cols - 1; j > 1; j--) {
        const firstBlock = blocks.find(it => it.correctRow == 1 && it.correctCol == j)!;
        const secondBlock = blocks.find(it => it.correctRow == 2 && it.correctCol == j)!;

        if (firstBlock.isCorrect && secondBlock.isCorrect) {
            continue;
        }

        await moveBlockToPosition(secondBlock, [firstBlock.correctRow, firstBlock.correctCol]);
        secondBlock.markFrezee();

        let success = await moveBlockToPosition(firstBlock, [firstBlock.correctRow, firstBlock.correctCol - 1]);
        if (!success) {
            secondBlock.unFrezee();
            await moveBlockToPosition(firstBlock, [firstBlock.correctRow, firstBlock.correctCol - 2]);
            firstBlock.markFrezee();
            secondBlock.unFrezee();
            await moveBlockToPosition(secondBlock, [firstBlock.correctRow, firstBlock.correctCol]);
            secondBlock.markFrezee();
            firstBlock.unFrezee();
            await moveBlockToPosition(firstBlock, [firstBlock.correctRow, firstBlock.correctCol - 1]);
        }
        firstBlock.markFrezee();
        secondBlock.unFrezee();

        await moveBlockToPosition(secondBlock, [secondBlock.correctRow, secondBlock.correctCol]);
        secondBlock.markFrezee();
        firstBlock.unFrezee();

        await moveBlockToPosition(firstBlock, [firstBlock.correctRow, firstBlock.correctCol]);
        firstBlock.markFrezee();
    }

    //Còn lại 4 ô nhưng chỉ cần gọi hàm xếp ô số 2 và ô số 1 thì các ô còn lại sẽ tự đúng vị trí
    const _2bl = blocks.find(it => it.value == 2)!;
    await moveBlockToPosition(_2bl, [_2bl.correctRow, _2bl.correctCol]);
    _2bl.markFrezee();

    const _1bl = blocks.find(it => it.value == 1)!;
    await moveBlockToPosition(_1bl, [_1bl.correctRow, _1bl.correctCol]);
    _1bl.markFrezee();

    status = 0;
    console.log(`Resolved in ${(Date.now() - start) / 1000}s`);
    clearHighlightEl();

    function clearHighlightEl() {
        if (document.querySelector('.puzzle-resolver-target')) {
            document.querySelector('.puzzle-resolver-target')?.classList.remove('puzzle-resolver-target')
        }
    }

    async function moveBlockToPosition(block: BlockWrapper, targetPosition: PairNumber): Promise<boolean> {
        if (status !== 1) {
            throw new Error('puzzle-resolver: Invalid status');
        }
        processingBlock = block;
        if (!block.isImage) {
            clearHighlightEl();
            block.getEl().classList.add('puzzle-resolver-target');
        }

        const block_target_p = calculateRelativePosition([block.row, block.col], targetPosition);

        if (block_target_p == Position.CENTER) {
            console.log(`Moved ${block.value} to ${targetPosition}`);
            ignoredBlock = {};
            return true;
        }

        if (blankBlock.row == 0) {
            console.log('Move blank block down due to row == 0');
            await move(Move.DOWN);
        }

        const blank_block_p = calculateRelativePosition([blankBlock.row, blankBlock.col], [block.row, block.col]);

        if (SAME_COLS.includes(blank_block_p)) {
            if (blank_block_p == Position.NEXT_TO_TOP) {
                //Ô trống đứng bên trên ô mục tiêu
                if (BOTTOM_SIDES.includes(block_target_p)) {
                    await move(Move.DOWN);
                } else {
                    let [moveType, fallbacks] = logicalMove(
                        LEFT_SIDES.includes(block_target_p) || block.col == 0,
                        [Move.RIGTH, [Move.LEFT, Move.UP]],
                        [Move.LEFT, [Move.RIGTH, Move.UP]]
                    );

                    if (!await tryMove(moveType, fallbacks, ignorePosition)) {
                        console.log('Cannot find next step ' + Position.NEXT_TO_TOP);
                        return false;
                    }
                }
                return await moveBlockToPosition(block, targetPosition);
            }

            if (blank_block_p == Position.NEXT_TO_BOTTOM) {
                //Ô trống đứng bên dưới ô mục tiêu

                if (TOP_SIDES.includes(block_target_p)) {
                    await move(Move.UP);
                } else {
                    let [moveType, fallbacks] = logicalMove(
                        LEFT_SIDES.includes(block_target_p) || block.col == 0,
                        [Move.RIGTH, [Move.LEFT, Move.DOWN]],
                        [Move.LEFT, [Move.RIGTH, Move.DOWN]]
                    );

                    if (!await tryMove(moveType, fallbacks, ignorePosition)) {
                        console.log('Cannot find next step ' + Position.NEXT_TO_BOTTOM);
                        return false;
                    }
                }
                return await moveBlockToPosition(block, targetPosition);
            }

            let [moveType, fallbacks] = logicalMove(
                blank_block_p == Position.TOP,
                [Move.DOWN, [Move.LEFT, Move.RIGTH, Move.UP]],
                [Move.UP, [Move.LEFT, Move.RIGTH, Move.DOWN]]
            );

            if (!await tryMove(moveType, fallbacks, ignorePosition)) {
                console.log('Cannot find next step SAME_COLS');
                return false;
            }

            return await moveBlockToPosition(block, targetPosition);
        }

        if (SAME_ROWS.includes(blank_block_p)) {
            if (blank_block_p == Position.NEXT_TO_LEFT) {
                //Ô trống đứng bên trái ô mục tiêu
                if (RIGHT_SIDES.includes(block_target_p)) {
                    await move(Move.RIGTH);
                } else {
                    let [moveType, fallbacks] = logicalMove(
                        TOP_SIDES.includes(block_target_p) || block.row == 1,
                        [Move.DOWN, [Move.UP, Move.LEFT]],
                        [Move.UP, [Move.DOWN, Move.LEFT]]
                    );

                    if (!await tryMove(moveType, fallbacks, ignorePosition)) {
                        console.log('Cannot find next step ' + Position.NEXT_TO_LEFT);
                        return false;
                    }
                }
                return await moveBlockToPosition(block, targetPosition);
            }

            if (blank_block_p == Position.NEXT_TO_RIGHT) {
                //Ô trống đứng bên phải ô mục tiêu
                if (LEFT_SIDES.includes(block_target_p)) {
                    await move(Move.LEFT);
                } else {
                    let [moveType, fallbacks] = logicalMove(
                        TOP_SIDES.includes(block_target_p) || block.row == 1,
                        [Move.DOWN, [Move.UP, Move.RIGTH]],
                        [Move.UP, [Move.DOWN, Move.RIGTH]]
                    );

                    if (!await tryMove(moveType, fallbacks, ignorePosition)) {
                        console.log('Cannot find next step ' + Position.NEXT_TO_RIGHT);
                        return false;
                    }
                }
                return await moveBlockToPosition(block, targetPosition);
            }

            let [moveType, fallbacks] = logicalMove(
                blank_block_p == Position.LEFT,
                [Move.RIGTH, [Move.LEFT, Move.DOWN, Move.UP]],
                [Move.LEFT, [Move.RIGTH, Move.DOWN, Move.UP]]
            );

            if (!await tryMove(moveType, fallbacks, ignorePosition)) {
                console.log('Cannot find next step SAME_ROWS');
                return false;
            }
            return await moveBlockToPosition(block, targetPosition);
        }

        let logicalMoveResult: LogicalMove | null = null;

        switch (blank_block_p) {
            case Position.TOP_LEFT:
                logicalMoveResult = logicalMove(
                    TOP_SIDES.includes(block_target_p) || RIGHT_SIDES.includes(block_target_p),
                    [Move.DOWN, [Move.RIGTH, Move.UP, Move.LEFT]],
                    [Move.RIGTH, [Move.DOWN, Move.UP, Move.LEFT]],
                )
                break;
            case Position.TOP_RIGHT:
                logicalMoveResult = logicalMove(
                    BOTTOM_SIDES.includes(block_target_p) || RIGHT_SIDES.includes(block_target_p),
                    [Move.LEFT, [Move.DOWN, Move.UP, Move.RIGTH]],
                    [Move.DOWN, [Move.LEFT, Move.UP, Move.RIGTH]],
                )
                break;
            case Position.BOTTOM_LEFT:
                logicalMoveResult = logicalMove(
                    TOP_SIDES.includes(block_target_p) || LEFT_SIDES.includes(block_target_p),
                    [Move.RIGTH, [Move.UP, Move.LEFT, Move.DOWN]],
                    [Move.UP, [Move.RIGTH, Move.LEFT, Move.DOWN]],
                )
                break;
            case Position.BOTTOM_RIGHT:
                logicalMoveResult = logicalMove(
                    TOP_SIDES.includes(block_target_p) || RIGHT_SIDES.includes(block_target_p),
                    [Move.LEFT, [Move.UP, Move.RIGTH, Move.DOWN]],
                    [Move.UP, [Move.LEFT, Move.RIGTH, Move.DOWN]],
                )
                break;
        }

        if (!logicalMoveResult || !await tryMove(logicalMoveResult[0], logicalMoveResult[1], ignorePosition)) {
            console.log(`Cannot find next step where ${blank_block_p}`);
            return false;
        }

        return await moveBlockToPosition(block, targetPosition);
    }

    function logicalMove(condition: boolean, truePhase: LogicalMove, falsePhase: LogicalMove) {
        return condition ? truePhase : falsePhase;
    }

    function ignorePosition(blankBlockPosition: PairNumber) {
        if (processingBlock) {
            ignoredBlock[`${processingBlock.value} - ${processingBlock.row} - ${processingBlock.col}--${blankBlockPosition[0]} - ${blankBlockPosition[1]}`] = true;
        }
    }

    async function tryMove(moveType: Move, fallbacks: Move[], onFallback: (p: PairNumber) => void): Promise<boolean> {
        if (await move(moveType)) {
            return true;
        }

        for (let index = 0; index < fallbacks.length; index++) {
            const element = fallbacks[index];
            const currentBlankBlockPosition = [blankBlock.row, blankBlock.col];
            if (await move(element)) {
                onFallback(currentBlankBlockPosition);
                return true;
            }
        }

        return false;
    }

    function move(moveType: Move) {
        return new Promise<boolean>(resolve => {
            const [rowDelta, colDeta] = tranformMove(moveType);
            const currentBlankPosition: PairNumber = [blankBlock.row, blankBlock.col]
            const targetBlock: PairNumber = [blankBlock.row + rowDelta, blankBlock.col + colDeta]
            if (!map[targetBlock[0]] || !map[targetBlock[0]][targetBlock[1]]) {
                console.log(`Move: Not exists target ${targetBlock}`);
                resolve(false);
                return;
            }

            if (map[targetBlock[0]][targetBlock[1]].value == -1 || map[targetBlock[0]][targetBlock[1]].frezee) {
                console.log(`Move: -1 or frezee ${targetBlock}`);
                resolve(false);
                return;
            }

            if (processingBlock && ignoredBlock[`${processingBlock.value} - ${processingBlock.row} - ${processingBlock.col}--${targetBlock[0]} - ${targetBlock[1]}`]) {
                console.log(`Move: -1 or frezee ${targetBlock}`);
                resolve(false);
                return;
            }

            map[targetBlock[0]][targetBlock[1]].click();
            setTimeout(() => {
                swap(map, currentBlankPosition, targetBlock);
                resolve(true);
            }, DELAY)
        })
    }
}

function calculateRelativePosition([row, col]: PairNumber, [targetRow, targetCol]: PairNumber): Position {
    if (row == targetRow) {
        if (col == targetCol) {
            return Position.CENTER;
        }

        if (Math.abs(col - targetCol) == 1) {
            return (col - targetCol) == -1 ? Position.NEXT_TO_LEFT : Position.NEXT_TO_RIGHT;
        }

        return col < targetCol ? Position.LEFT : Position.RIGHT;
    }

    if (row < targetRow) {
        if (col == targetCol) {
            return (row - targetRow) == -1 ? Position.NEXT_TO_TOP : Position.TOP;
        }

        return col < targetCol ? Position.TOP_LEFT : Position.TOP_RIGHT;
    }

    if (col == targetCol) {
        return (row - targetRow) == 1 ? Position.NEXT_TO_BOTTOM : Position.BOTTOM;
    }

    return col < targetCol ? Position.BOTTOM_LEFT : Position.BOTTOM_RIGHT;


}

function swap(map: BlockWrapper[][], [row1, col1]: PairNumber, [row2, col2]: PairNumber) {
    const tmp = map[row2][col2];
    map[row2][col2] = map[row1][col1];
    map[row1][col1] = tmp;
}

function tranformMove(move: Move): PairNumber {
    switch (move) {
        case Move.UP:
            return [-1, 0];
        case Move.DOWN:
            return [1, 0];
        case Move.LEFT:
            return [0, -1];
        case Move.RIGTH:
            return [0, 1];
    }
}

function initBlankMap(gameConfig: GameConfig): BlockWrapper[][] {
    const map = [];
    let tmpEl = document.createElement('div');
    for (let i = 0; i < gameConfig.rows; i++) {
        let r = [];
        for (let j = 0; j < gameConfig.cols; j++) {
            r.push(BlockWrapper.fromEl(tmpEl));
        }
        map.push(r);
    }
    return map;
}

type Pair<Type> = Type[];

type PairNumber = Pair<number>;

interface LogicalMove extends Array<Move | Move[]> { 0: Move; 1: Move[] }

enum Move {
    UP, DOWN, LEFT, RIGTH
}

enum Position {
    TOP = 'TOP', RIGHT = 'RIGHT', BOTTOM = 'BOTTOM', LEFT = 'LEFT',
    TOP_LEFT = 'TOP_LEFT', TOP_RIGHT = 'TOP_RIGHT', BOTTOM_LEFT = 'BOTTOM_LEFT', BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    CENTER = 'CENTER',
    NEXT_TO_LEFT = 'NEXT_TO_LEFT', NEXT_TO_RIGHT = 'NEXT_TO_RIGHT', NEXT_TO_TOP = 'NEXT_TO_TOP', NEXT_TO_BOTTOM = 'NEXT_TO_BOTTOM'
}

class GameConfig {
    rows: number;
    cols: number;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    }
}

class BlockWrapper {
    private el: HTMLDivElement;
    private val: number;
    private cRow: number;
    private cCol: number;
    private isFrezee: boolean;

    constructor(el: HTMLDivElement) {
        this.el = el;
        this.cRow = -1;
        this.cCol = -1;
        this.val = parseInt(this.el.dataset['value'] || '-1');
        this.isFrezee = false;
    }

    public getEl() {
        return this.el;
    }

    public click() {
        this.el.click();
    }

    public static fromEl(el: Element) {
        return new BlockWrapper(el as HTMLDivElement);
    }

    public markFrezee() {
        this.isFrezee = true;
    }

    public unFrezee() {
        this.isFrezee = false;
    }

    public setCorrectPosition(row: number, col: number) {
        this.cRow = row;
        this.cCol = col;
    }

    public get row(): number {
        return parseInt(this.el.dataset['currentRow']!)
    }

    public get col(): number {
        return parseInt(this.el.dataset['currentCol']!)
    }

    public get value(): number {
        return this.val;
    }

    public get frezee(): boolean {
        return this.isFrezee;
    }

    public get correctRow(): number {
        return this.cRow;
    }

    public get correctCol(): number {
        return this.cCol;
    }

    public get isCorrect(): boolean {
        return this.row === this.cRow && this.col === this.cCol;
    }

    public get isImage(): boolean {
        return this.el.classList.contains('block-mode-image')
    }
}

function convertValueToCorrectPosition(value: number, gridCols: number) {
    if (value == 0) {
        return [0, 0];
    }

    return [
        value % gridCols == 0 ? value / gridCols : (Math.floor(value / gridCols) + 1),
        value % gridCols == 0 ? gridCols - 1 : (value % gridCols - 1)
    ];
}