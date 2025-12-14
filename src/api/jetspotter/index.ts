import { Router } from 'express'
import { postDiscMsg } from './routes/discord'
import { getStats } from './routes/stats'

export const jetspotterRouter = Router()

jetspotterRouter.post('/', postDiscMsg)
jetspotterRouter.get('/stats', getStats)