import { login } from './bot'
import { web } from './web'

;(async () => {
  login()
  web.listen(9002, () => console.log('Express web running on http://localhost:9002'))
})().catch(console.error)