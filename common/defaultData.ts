import type { WorldData } from './dataTypes'

export function makeDefaultData(): WorldData {
  // Ignore Prettier to keep JSON compatible
  // prettier-ignore
  return {
    "config": {
      "gridCellWidth": 16,
      "gridCellHeight": 16,
      // TODO: come up with a better working default tileset (see tiles below).
      "tileset": '__builtin',
      "tilesetTileWidth": 16,
      "tilesetTileHeight": 16,
      "layers": [{ "name": "Static" }, { "name": "Entities" }],
      "tiles": [
        { "name": "Empty" },
        { "name": "T1", "x": 0, "y": 0, "allowedLayers": [0] },
        { "name": "T2", "x": 16, "y": 0, "allowedLayers": [0] },
        { "name": "T3", "x": 32, "y": 0, "allowedLayers": [0] },
        { "name": "T4", "x": 48, "y": 0, "allowedLayers": [0] },
        { "name": "Player", "x": 0, "y": 16, "allowedLayers": [1] },
        { "name": "Bush1", "x": 16, "y": 16, "allowedLayers": [1] },
        { "name": "Bush2", "x": 32, "y": 16, "allowedLayers": [1] },
        { "name": "Trunk", "x": 48, "y": 16, "allowedLayers": [1] }
      ],
    },
    levels: [makeDefaultLevel()],
  }
}

export function makeDefaultLevel() {
  // Ignore Prettier to keep JSON compatible
  // prettier-ignore
  return {
    "properties": {
      "name": "My level"
    },
    "width": 10,
    "height": 10,
    "layers": [
      {
        "data": [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]
      },
      {
        "data": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
      }
    ]
  }
}
