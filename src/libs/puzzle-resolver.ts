
export async function resolve() {
    const DELAY = 10;
    const SAME_COLS = [Position.TOP, Position.NEXT_TO_TOP, Position.CENTER, Position.NEXT_TO_BOTTOM, Position.BOTTOM];
    const SAME_ROWS = [Position.LEFT, Position.NEXT_TO_LEFT, Position.CENTER, Position.NEXT_TO_RIGHT, Position.RIGHT];
    const LEFT_SIDES = [Position.TOP_LEFT, Position.NEXT_TO_LEFT, Position.LEFT, Position.BOTTOM_LEFT];
    const RIGHT_SIDES = [Position.TOP_RIGHT, Position.NEXT_TO_RIGHT, Position.RIGHT, Position.BOTTOM_RIGHT];
    const TOP_SIDES = [Position.TOP_LEFT, Position.NEXT_TO_TOP, Position.TOP, Position.TOP_RIGHT];
    const BOTTOM_SIDES = [Position.BOTTOM_LEFT, Position.NEXT_TO_BOTTOM, Position.BOTTOM, Position.BOTTOM_RIGHT];

    console.clear();
    console.log('Resolving...');
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

    const blankBlock = blocks.find(el => el.value == 0)!;

    let processingBlock: BlockWrapper | null = null;
    let ignoredBlock: Record<string, boolean> = {};

    const _9bl = blocks.find(it => it.value == 9)!;
    const _8bl = blocks.find(it => it.value == 8)!;
    const _7bl = blocks.find(it => it.value == 7)!;
    const _6bl = blocks.find(it => it.value == 6)!;
    const _5bl = blocks.find(it => it.value == 5)!;
    const _4bl = blocks.find(it => it.value == 4)!;
    const _3bl = blocks.find(it => it.value == 3)!;
    const _2bl = blocks.find(it => it.value == 2)!;
    const _1bl = blocks.find(it => it.value == 1)!;

    let success: boolean | void = false;

    await moveBlockToPosition(_9bl, [_9bl.correctRow, _9bl.correctCol]);
    _9bl.markFrezee();

    await moveBlockToPosition(_7bl, [_8bl.correctRow, _8bl.correctCol]);
    _7bl.markFrezee();

    success = await moveBlockToPosition(_8bl, [_5bl.correctRow, _5bl.correctCol]);
    console.log('Move 8 to 5 ' + success);

    if (!success) {
        _7bl.unFrezee();

        await moveBlockToPosition(_8bl, [_1bl.correctRow, _1bl.correctCol]);
        _8bl.markFrezee();

        await moveBlockToPosition(_7bl, [_8bl.correctRow, _8bl.correctCol]);
        _7bl.markFrezee();

        _8bl.unFrezee();
        await moveBlockToPosition(_8bl, [_5bl.correctRow, _5bl.correctCol]);
    }
    _8bl.markFrezee();
    _7bl.unFrezee();

    await moveBlockToPosition(_7bl, [_7bl.correctRow, _7bl.correctCol]);
    _7bl.markFrezee();
    _8bl.unFrezee();

    await moveBlockToPosition(_8bl, [_8bl.correctRow, _8bl.correctCol]);
    _8bl.markFrezee();

    console.log('Done row 1');

    await moveBlockToPosition(_6bl, [_3bl.correctRow, _3bl.correctCol]);
    _6bl.markFrezee();

    success = false;
    success = await moveBlockToPosition(_3bl, [_2bl.correctRow, _2bl.correctCol]);
    if (!success) {
        _6bl.unFrezee();
        await moveBlockToPosition(_3bl, [_1bl.correctRow, _1bl.correctCol]);
        _3bl.markFrezee();
        _6bl.unFrezee();
        await moveBlockToPosition(_6bl, [_3bl.correctRow, _3bl.correctCol]);
        _6bl.markFrezee();
        _3bl.unFrezee();
        await moveBlockToPosition(_3bl, [_2bl.correctRow, _2bl.correctCol]);
    }
    _3bl.markFrezee();
    _6bl.unFrezee();
    await moveBlockToPosition(_6bl, [_6bl.correctRow, _6bl.correctCol]);
    _6bl.markFrezee();
    _3bl.unFrezee();

    await moveBlockToPosition(_3bl, [_3bl.correctRow, _3bl.correctCol]);
    _3bl.markFrezee();

    await moveBlockToPosition(_2bl, [_2bl.correctRow, _2bl.correctCol]);
    _3bl.markFrezee();

    await moveBlockToPosition(_5bl, [_5bl.correctRow, _5bl.correctCol]);
    _5bl.markFrezee();

    await moveBlockToPosition(_4bl, [_4bl.correctRow, _4bl.correctCol]);
    _4bl.markFrezee();

    await moveBlockToPosition(_1bl, [_1bl.correctRow, _1bl.correctCol]);


    async function moveBlockToPosition(block: BlockWrapper, targetPosition: PairNumber): Promise<boolean> {
        processingBlock = block;
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
                    let success = await tryMove(LEFT_SIDES.includes(block_target_p) || block.col == 0 ? Move.RIGTH : Move.LEFT, [Move.RIGTH, Move.LEFT, Move.UP], markIgnoredCurrentBlankBlock);
                    if (!success) {
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
                    let success = await tryMove(LEFT_SIDES.includes(block_target_p) || block.col == 0 ? Move.RIGTH : Move.LEFT, [Move.RIGTH, Move.LEFT, Move.DOWN], markIgnoredCurrentBlankBlock);
                    if (!success) {
                        console.log('Cannot find next step ' + Position.NEXT_TO_BOTTOM);
                        return false;
                    }
                }
                return await moveBlockToPosition(block, targetPosition);
            }

            let success = await tryMove(blank_block_p == Position.TOP ? Move.DOWN : Move.UP, [Move.DOWN, Move.UP, Move.LEFT, Move.RIGTH], markIgnoredCurrentBlankBlock);
            if (!success) {
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
                    let success = await tryMove(TOP_SIDES.includes(block_target_p) || block.row == 1 ? Move.DOWN : Move.UP, [Move.DOWN, Move.UP, Move.LEFT], markIgnoredCurrentBlankBlock);
                    if (!success) {
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
                    let success = await tryMove(TOP_SIDES.includes(block_target_p) || block.row == 1 ? Move.DOWN : Move.UP, [Move.DOWN, Move.UP, Move.RIGTH], markIgnoredCurrentBlankBlock);
                    if (!success) {
                        console.log('Cannot find next step ' + Position.NEXT_TO_RIGHT);
                        return false;
                    }
                }
                return await moveBlockToPosition(block, targetPosition);
            }

            let success = await tryMove(blank_block_p == Position.LEFT ? Move.RIGTH : Move.LEFT, [Move.RIGTH, Move.LEFT, Move.DOWN], markIgnoredCurrentBlankBlock);
            if (!success) {
                console.log('Cannot find next step SAME_ROWS');
                return false;
            }
            return await moveBlockToPosition(block, targetPosition);
        }

        let success = false;

        switch (blank_block_p) {
            case Position.TOP_LEFT:
                success = await tryMove(TOP_SIDES.includes(block_target_p) || RIGHT_SIDES.includes(block_target_p) ? Move.DOWN : Move.RIGTH, [Move.DOWN, Move.RIGTH, Move.UP, Move.LEFT], markIgnoredCurrentBlankBlock);
                if (!success) {
                    console.log(`Cannot find next step where ${Position.TOP_LEFT}`);
                }
                break;
            case Position.TOP_RIGHT:
                success = await tryMove(BOTTOM_SIDES.includes(block_target_p) ? Move.LEFT : Move.DOWN, [Move.LEFT, Move.DOWN, Move.UP, Move.RIGTH], markIgnoredCurrentBlankBlock);
                if (!success) {
                    console.log(`Cannot find next step where ${Position.TOP_RIGHT}`);
                }
                break;
            case Position.BOTTOM_LEFT:
                success = await tryMove(TOP_SIDES.includes(block_target_p) || LEFT_SIDES.includes(block_target_p) ? Move.RIGTH : Move.UP, [Move.RIGTH, Move.UP, Move.LEFT, Move.DOWN], markIgnoredCurrentBlankBlock);
                if (!success) {
                    console.log(`Cannot find next step where ${Position.BOTTOM_LEFT}`);
                }
                break;
            case Position.BOTTOM_RIGHT:
                success = await tryMove(TOP_SIDES.includes(block_target_p) ? Move.LEFT : Move.UP, [Move.LEFT, Move.UP, Move.RIGTH, Move.DOWN], markIgnoredCurrentBlankBlock);
                if (!success) {
                    console.log(`Cannot find next step where ${Position.BOTTOM_RIGHT}`);
                }
                break;
            default:
        }

        if (!success) {
            return false;
        }

        return await moveBlockToPosition(block, targetPosition);
    }

    function markIgnoredCurrentBlankBlock(blankBlockPosition: PairNumber) {
        if (processingBlock) {
            console.log(`markIgnore ${processingBlock.value}-${processingBlock.row}-${processingBlock.col}--${blankBlockPosition[0]}-${blankBlockPosition[1]}`);

            ignoredBlock[`${processingBlock.value}-${processingBlock.row}-${processingBlock.col}--${blankBlockPosition[0]}-${blankBlockPosition[1]}`] = true;
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

            if (processingBlock && ignoredBlock[`${processingBlock.value}-${processingBlock.row}-${processingBlock.col}--${targetBlock[0]}-${targetBlock[1]}`]) {
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