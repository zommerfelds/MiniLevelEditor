import express, { Express, Request, Response } from 'express'
import { promises as fsPromises } from 'fs';

const app: Express = express()
const port = 3000

const args = process.argv.slice(2)
const filePath = args[0]
if (filePath === undefined) {
  throw "No file path argument specified"
}

console.info('Loading from file ' + filePath)

async function main() {
  const fileJsonStr = await fsPromises.readFile(filePath, 'utf8')
  console.info('Data: ' + fileJsonStr)
  let inMemoryData = JSON.parse(fileJsonStr)

  app.use(express.json());

  app.get('/get', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(inMemoryData))
  })

  app.post('/post', async (req: Request, res: Response) => {
    inMemoryData = req.body
    const jsonStr = JSON.stringify(inMemoryData)
    await fsPromises.writeFile(filePath, jsonStr)
    console.log("Saving new value:", jsonStr);
    res.send("OK")
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}

main()