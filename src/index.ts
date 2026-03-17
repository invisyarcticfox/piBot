import { startBot } from './bot'
import { app } from './api'

async function main() {
  await startBot()
  app.listen(9008 ,() => console.log('Express API running on http://raspi:9008'))
}

main().catch(console.error)