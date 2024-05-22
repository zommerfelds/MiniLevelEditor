import express, { Express, Request, Response } from 'express'
import { promises as fsPromises } from 'fs'
import { format } from 'prettier'
import { makeDefaultData } from '../common/defaultData.js'

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
  const defaultData = makeDefaultData()
  try {
    await fsPromises.writeFile(filePath, JSON.stringify(defaultData), { flag: 'wx' })
    console.info(`Created empty file ${filePath}`)
  } catch (err) {
    // Ignore errors writing the default file, as it may exist already.
  }

  const fileJsonStr = await fsPromises.readFile(filePath, 'utf8')
  console.info(`Loaded data from "${filePath}"`)
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
