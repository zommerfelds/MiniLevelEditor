import { v4 as uuidv4 } from 'uuid'
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
          name: 'Static',
          properties: [{ key: 'isWall', type: 'Bool', default: true, optional: false }],
        },
        {
          name: 'Entity',
          properties: [{ key: 'health', type: 'Float', default: 1, optional: false }],
        },
      ],
      layers: [
        { name: 'Static', allowedTypes: ['Static'] },
        { name: 'Entities', allowedTypes: ['Entity'] },
      ],
      tileset: [
        { name: 'T1', x: 0, y: 0, types: ['Static'] },
        { name: 'T2', x: 16, y: 0, types: ['Static'] },
        { name: 'T3', x: 32, y: 0, types: ['Static'] },
        { name: 'T4', x: 48, y: 0, types: ['Static'] },
        { name: 'Player', x: 0, y: 16, types: ['Entity'] },
        { name: 'Bush1', x: 16, y: 16, types: ['Entity'] },
        { name: 'Bush2', x: 32, y: 16, types: ['Entity'] },
        { name: 'Trunk', x: 48, y: 16, types: ['Entity'] },
      ],
    },
    levels: [makeDefaultLevel()],
  }
}

export function makeDefaultLevel() {
  return {
    id: uuidv4(),
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
