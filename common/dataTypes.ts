export type Tile = {
  name: String
  x?: number
  y?: number
  types: UserDefinedTypeName[]
}

export type PropertySchema = PropertySchemaEntry[]

export type PropertySchemaEntry = {
  key: string
  optional: boolean
} & (PropertyBoolean | PropertyInt | PropertyFloat | PropertyString | PropertyPosition)

export type PropertyBoolean = {
  type: 'Bool'
  default: boolean
}
export type PropertyInt = {
  type: 'Int'
  default: number
}
export type PropertyFloat = {
  type: 'Float'
  default: number
}
export type PropertyString = {
  type: 'String'
  default: string
}
export type PropertyPosition = {
  type: 'Position'
  default: { x: number; y: number }
}

export type UserDefinedTypeName = string

export type UserDefinedType = {
  name: UserDefinedTypeName
  properties: PropertySchema
}

export type LayerConfig = {
  name: string
  allowedTypes?: UserDefinedTypeName[]
}

export type Config = {
  gridCellWidth: number
  gridCellHeight: number
  tilesetImage: string
  tilesetTileWidth: number
  tilesetTileHeight: number
  tileTypes: UserDefinedType[]
  layers: LayerConfig[]
  tileset: Tile[]
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
