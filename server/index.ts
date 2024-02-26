import express, { Express, Request, Response } from 'express'
import { promises as fsPromises } from 'fs'
import { format } from 'prettier'
import defaultLevel from '../common/level-default.json'

const app: Express = express()
const port = 3000

const args = process.argv.slice(2)
let filePath = args[0]
if (filePath === undefined) {
  filePath = 'levels.json'
  console.info(`No file path argument specified, defaulting to "${filePath}"`)
}

const tilesetDir = 'test' // TODO: make configurable

async function main() {
  const defaultData = {
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
  try {
    await fsPromises.writeFile(filePath, JSON.stringify(defaultData), { flag: 'wx' })
    console.info(`Created empty file ${filePath}`)
  } catch (err) {
    // Ignore errors writing the default file, as it may exist already.
  }

  const fileJsonStr = await fsPromises.readFile(filePath, 'utf8')
  console.info(`Loaded data from ${filePath}`)
  let inMemoryData = JSON.parse(fileJsonStr)

  app.use(express.json())

  app.use('/tilesets', express.static(tilesetDir))
  app.get('/tileset-list', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    const files = await fsPromises.readdir(tilesetDir)
    res.send(JSON.stringify({ files }))
  })

  app.get('/get', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(inMemoryData))
  })

  app.post('/post', async (req: Request, res: Response) => {
    inMemoryData = req.body
    const jsonStr = JSON.stringify(inMemoryData)
    const jsonStrPretty = await format(jsonStr, { parser: 'json' })
    await fsPromises.writeFile(filePath, jsonStrPretty)
    console.log('Saving new value:', jsonStrPretty)
    res.send('OK')
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}

main()
