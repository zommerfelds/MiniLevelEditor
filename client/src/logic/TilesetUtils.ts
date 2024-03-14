import { useWorldStore } from '@/stores/world'

export class TilesetUtils {
  store = useWorldStore()

  getPath(): string {
    if (this.store.data.config?.tileset == undefined) return ''

    if (this.store.data.config.tileset == '__builtin') {
      return 'built-in-tileset.png'
    }
    return 'api/tilesets/' + this.store.data.config.tileset
  }

  getAtlas(): object {
    if (this.store.data.config?.tiles == undefined) return {}

    // Format example: https://github.com/phaserjs/examples/blob/master/public/src/loader/texture%20atlas%20json/load%20atlas%20with%20local%20json.js
    return {
      frames: this.store.data.config.tiles
        .map((tile: any, index: number) => ({ tile, index }))
        .filter(({ tile }: { tile: any }) => tile.x != undefined)
        .map(({ tile, index }: { tile: any; index: number }) => ({
          filename: String(index),
          rotated: false,
          trimmed: false,
          frame: { x: tile.x, y: tile.y, w: 16, h: 16 },
        })),
    }
  }

  isEmptyTile(tileIndex: number): boolean {
    return this.store.data.config.tiles[tileIndex].x == undefined
  }

  setEmpty(tile: any) {
    delete tile.x
    delete tile.y
  }

  setFromTileset(tile: any, x: number, y: number) {
    tile.x = x
    tile.y = y
  }

  getIconStyle(tile: any, iconSize: number) {
    const imageWidth = 64 // TODO: don't hardcode
    const backgroundSize = imageWidth * (iconSize / this.store.data.config.tilesetTileWidth)

    const style = {
      width: iconSize + 'px',
      height: iconSize + 'px',
    }

    if (tile.x == undefined) {
      return { ...style, 'background-color': 'black' }
    }
    return {
      ...style,
      'background-position':
        iconSize * (-tile.x / this.store.data.config.tilesetTileWidth) +
        'px ' +
        iconSize * (-tile.y / this.store.data.config.tilesetTileHeight) +
        'px',
      'background-image': 'url("' + this.getPath() + '")',
      'background-size': backgroundSize + 'px',
    }
  }
}
