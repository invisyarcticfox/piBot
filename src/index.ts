import { startBot } from './bot'
import { app } from './api'

async function main() {
  await startBot()
  app.listen(9002 ,() => console.log('Express API running on http://raspi:9002'))
}

main().catch(console.error)