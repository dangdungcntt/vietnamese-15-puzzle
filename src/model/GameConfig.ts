export enum GameMode {
    CLASSIC = 'CLASSIC', IMAGE = 'IMAGE'
}

export enum GameStatus {
    WAITING = 'WAITING', PLAYING = 'PLAYING', WIN = 'WIN', PAUSED = 'PAUSED'
}

export type ImageModeConfig = {
    url: string
}

export type MapSpec = {
    gridRows: number,
    gridCols: number,
}

export type BlockConfig = {
    gap: number,
    borderRadius: number,
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
    blockConfig: BlockConfig,
}

export enum CellType {
    WALL = 'WALL', BLOCK = 'BLOCK'
}