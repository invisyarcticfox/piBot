import { startBot } from './bot'
import { app } from './api'


async function main() {
  await startBot()
  app.listen(9002, () => console.log('Bot and API running on port 9002'))
}

main().catch(console.error)