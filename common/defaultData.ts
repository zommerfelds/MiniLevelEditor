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
        // TODO: consider making 'name' the key of an object instead of an array.
        {
          name: 'Static',
          properties: [{ key: 'isWall', type: 'Bool', defaultBool: true, optional: false }],
        },
        {
          name: 'Entity',
          properties: [{ key: 'health', type: 'Float', defaultFloat: 1, optional: false }],
        },
      ],
      layers: [
        { name: 'Static', allowedTypes: ['Static'] },
        { name: 'Entities', allowedTypes: ['Entity'] },
      ],
      tileset: [
        { name: 'T1', x: 0, y: 0, types: ['Static'], properties: { isWall: false } },
        { name: 'T2', x: 16, y: 0, types: ['Static'], properties: { isWall: false } },
        { name: 'T3', x: 32, y: 0, types: ['Static'], properties: { isWall: false } },
        { name: 'T4', x: 48, y: 0, types: ['Static'], properties: { isWall: false } },
        { name: 'Player', x: 0, y: 16, types: ['Entity'], properties: { health: 10 } },
        { name: 'Bush1', x: 16, y: 16, types: ['Entity'], properties: {} },
        { name: 'Bush2', x: 32, y: 16, types: ['Entity'], properties: {} },
        { name: 'Trunk', x: 48, y: 16, types: ['Entity'], properties: {} },
      ],
    },
    levels: [makeDefaultLevel()],
  }
}

export function makeDefaultLevel() {
  const id = uuidv4()
  return {
    id,
    name: 'Level ' + id.substring(0, 5).toUpperCase(),
    properties: {},
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
