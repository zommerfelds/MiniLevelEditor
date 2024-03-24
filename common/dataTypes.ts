export type Tile = {
  name: String
  x?: number
  y?: number
  types: UserDefinedTypeName[]
  properties: { [key: string]: boolean | number | string | Position }
}

export type Position = { x: number; y: number }

export type PropertySchema = PropertySchemaEntry[]

export type PropertySchemaEntry = {
  key: string
  optional: boolean
  type: PropertySchemaTypeName
} & (PropertyBoolean | PropertyInt | PropertyFloat | PropertyString | PropertyPosition)

export type PropertySchemaTypeName = 'Bool' | 'Int' | 'Float' | 'String' | 'Position'

export type PropertyBoolean = {
  type: 'Bool'
  defaultBool: boolean
}
export type PropertyInt = {
  type: 'Int'
  defaultInt: number
}
export type PropertyFloat = {
  type: 'Float'
  defaultFloat: number
}
export type PropertyString = {
  type: 'String'
  defaultString: string
}
export type PropertyPosition = {
  type: 'Position'
  defaultPosition: Position
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
  name: string
  properties: { [key: string]: string }
  width: number
  height: number
  layers: { data: number[] }[]
}

export type WorldData = {
  config: Config
  levels: Level[]
}
