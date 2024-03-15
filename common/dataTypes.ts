export type Tile = {
  name: String
  x?: number
  y?: number
  allowedLayers?: number[]
}

export type Config = {
  gridCellWidth: number
  gridCellHeight: number
  tileset: string
  tilesetTileWidth: number
  tilesetTileHeight: number
  layers: { name: string }[]
  tiles: Tile[]
}

export type Level = {
  properties: { [key: string]: string }
  width: number
  height: number
  layers: { data: number[] }[]
}

export type WorldData = {
  config: Config
  levels: Level[]
}
