export enum GameMode {
    CLASSIC = 'CLASSIC', IMAGE = 'IMAGE'
}

export enum GameStatus {
    WAITING = 'WAITING', PLAYING = 'PLAYING', WIN = 'WIN'
}

export type ImageModeConfig = {
    url: string
}

export type MapSpec = {
    gridRows: number,
    gridCols: number,
}

export type BlockSpec = {
    size: number,
    gap: number,
    borderRadius: number,
}

export type ContainerSpec = {
    width: number,
    height: number,
    backgroundWidth: number,
    backgroundHeight: number,
}

export type GameConfig = {
    mode: GameMode,
    image: ImageModeConfig,
    mapSpec: MapSpec,
    blockSpec: BlockSpec,
    containerSpec: ContainerSpec
}

export enum CellType {
    WALL = 'WALL', BLOCK = 'BLOCK'
}

export type Cell = {
    type: CellType;
    value: number,
    text?: string,
    row: number,
    col: number,
    correctRow: number,
    correctCol: number,
}