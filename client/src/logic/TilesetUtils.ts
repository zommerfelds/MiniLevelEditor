import { useWorldStore } from '@/stores/world'
import type { Tile } from '@common/dataTypes'

export class TilesetUtils {
  world = useWorldStore()

  getPath(): string {
    if (this.world.getWorldData().config?.tilesetImage === undefined) return ''

    if (this.world.getWorldData().config.tilesetImage === '__builtin') {
      return 'built-in-tileset.png'
    }
    return 'api/tilesets/' + this.world.getWorldData().config.tilesetImage
  }

  getAtlas(): object {
    if (this.world.getWorldData().config?.tileset === undefined) return {}

    // Format example: https://github.com/phaserjs/examples/blob/master/public/src/loader/texture%20atlas%20json/load%20atlas%20with%20local%20json.js
    return {
      frames: this.world
        .getWorldData()
        .config.tileset.map((tile: Tile, index: number) => ({ tile, index }))
        .filter(({ tile }: { tile: Tile }) => tile.x !== undefined)
        .map(({ tile, index }: { tile: Tile; index: number }) => ({
          filename: String(index),
          rotated: false,
          trimmed: false,
          frame: { x: tile.x, y: tile.y, w: 16, h: 16 },
        })),
    }
  }

  isEmptyTileIndex(tileIndex?: number): boolean {
    if (tileIndex === undefined || tileIndex < 0) return true
    const tile = this.world.getWorldData().config.tileset[tileIndex]
    return tile ? this.isEmptyTile(tile) : true
  }
  isEmptyTile(tile: Tile): boolean {
    return tile.x === undefined
  }

  setEmpty(tile: Tile) {
    delete tile.x
    delete tile.y
  }

  setFromTileset(tile: Tile, x: number, y: number) {
    tile.x = x
    tile.y = y
  }

  getIconStyle(tile: Tile, iconSize: number) {
    const imageWidth = 64 // TODO: don't hardcode
    const backgroundSize =
      imageWidth * (iconSize / this.world.getWorldData().config.tilesetTileWidth)

    const style = {
      width: iconSize + 'px',
      height: iconSize + 'px',
    }

    if (tile.x === undefined || tile.y === undefined) {
      return { ...style, 'background-color': 'black' }
    }
    return {
      ...style,
      'background-position':
        iconSize * (-tile.x / this.world.getWorldData().config.tilesetTileWidth) +
        'px ' +
        iconSize * (-tile.y / this.world.getWorldData().config.tilesetTileHeight) +
        'px',
      'background-image': 'url("' + this.getPath() + '")',
      'background-size': backgroundSize + 'px',
    }
  }
}
