export type Cell = {
    type: 'wall' | 'block';
    value: number,
    text?: string,
    row: number,
    col: number,
    isBorderX?: boolean
    isBorderY?: boolean
}