import type { WorldData } from './dataTypes'

export function makeDefaultData(): WorldData {
  return {
    config: {
      gridCellWidth: 16,
      gridCellHeight: 16,
      // TODO: come up with a better working default tileset (see tiles below).
      tilesetImage: '__builtin',
      tilesetTileWidth: 16,
      tilesetTileHeight: 16,
      tileTypes: [
        {
          name: 'static',
          properties: [{ key: 'isWall', type: 'Bool', default: true, optional: false }],
        },
        {
          name: 'entity',
          properties: [{ key: 'health', type: 'Float', default: 1, optional: false }],
        },
      ],
      layers: [
        { name: 'Static', allowedTypes: ['static'] },
        { name: 'Entities', allowedTypes: ['entity'] },
      ],
      tileset: [
        { name: 'T1', x: 0, y: 0, types: ['static'] },
        { name: 'T2', x: 16, y: 0, types: ['static'] },
        { name: 'T3', x: 32, y: 0, types: ['static'] },
        { name: 'T4', x: 48, y: 0, types: ['static'] },
        { name: 'Player', x: 0, y: 16, types: ['entity'] },
        { name: 'Bush1', x: 16, y: 16, types: ['entity'] },
        { name: 'Bush2', x: 32, y: 16, types: ['entity'] },
        { name: 'Trunk', x: 48, y: 16, types: ['entity'] },
      ],
    },
    levels: [makeDefaultLevel()],
  }
}

export function makeDefaultLevel() {
  return {
    properties: {
      name: 'My level',
    },
    width: 10,
    height: 10,
    layers: [
      {
        data: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
      },
      {
        data: [
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
          -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        ],
      },
    ],
  }
}
