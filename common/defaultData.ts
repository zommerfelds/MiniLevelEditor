import defaultLevel from './level-default.json'

export function makeDefaultData() {
  return {
    config: {
      gridCellWidth: 16,
      gridCellHeight: 16,
      // TODO: come up with a better working default tileset (see tiles below).
      tileset: '__builtin',
      tilesetTileWidth: 16,
      tilesetTileHeight: 16,
      layers: [{ name: 'Static' }, { name: 'Entities' }],
      tiles: [
        { "name": "Empty" },
        { "name": "T1", "x": 0, "y": 0 },
        { "name": "T2", "x": 16, "y": 0 },
        { "name": "T3", "x": 32, "y": 0 },
        { "name": "T4", "x": 48, "y": 0 },
        { "name": "Player", "x": 0, "y": 16 },
        { "name": "Bush1", "x": 16, "y": 16 },
        { "name": "Bush2", "x": 32, "y": 16 },
        { "name": "Trunk", "x": 48, "y": 16 }
      ],
    },
    levels: [defaultLevel],
  }
}
