import { startBot } from './bot'
import { app } from './api'


async function main() {
  await startBot()
  app.listen(3621, () => console.log('Bot and API running on port 3621'))
}

main().catch(console.error)