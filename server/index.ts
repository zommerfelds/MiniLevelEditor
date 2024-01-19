import express, { Express, Request, Response } from 'express'

const app: Express = express()
const port = 3000

let inMemoryData = { levels: [{ name: 'level 1', message: 'level 1 content' }] };

app.use(express.json());

app.get('/get', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(inMemoryData))
})

app.post('/post', (req: Request, res: Response) => {
  inMemoryData = req.body;
  console.log("Saving new value:", JSON.stringify(inMemoryData));
  res.send("OK")
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
