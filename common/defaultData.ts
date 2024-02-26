import defaultLevel from './level-default.json'

export function makeDefaultData() {
    return {
        "config": {
          "gridCellWidth": 16,
          "gridCellHeight": 16,
          // TODO: come up with a better working default tileset (see tiles below).
          "tileset": 'tileset1.png',
          "tilesetTileWidth": 16,
          "tilesetTileHeight": 16,
          "layers": [{ "name": "Static" }, { "name": "Entities" }],
          "tiles": [
            { "name": "Empty" },
            { "name": "T1", "index": 0 },
            { "name": "T2", "index": 1 },
            { "name": "T3", "index": 2 },
            { "name": "T4", "index": 3 },
            { "name": "Player", "index": 4 },
            { "name": "Bush1", "index": 5 },
            { "name": "Bush2", "index": 6 },
            { "name": "Trunk", "index": 7 }
          ]
        },
        "levels": [defaultLevel],
      }
}