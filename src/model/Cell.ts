import { CellType } from "./GameConfig";

export default class Cell {
    type: CellType;
    value: number;
    text?: string;
    row: number;
    col: number;
    correctRow: number;
    correctCol: number;

    constructor({ type, value, row, col }: Cell) {
        this.type = type;
        this.value = value;
        this.row = row;
        this.col = col;

        this.correctRow = -1;
        this.correctCol = -1;
    }

    public get isCorrect(): boolean {
        return this.row === this.correctRow && this.col === this.correctCol;
    }

    public get isBlockItem(): boolean {
        return this.value > 0;
    }

    public get isBlockBlank(): boolean {
        return this.value === 0;
    }

    public get isWall(): boolean {
        return this.type === CellType.WALL;
    }
}