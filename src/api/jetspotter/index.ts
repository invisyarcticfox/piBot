import { Router } from 'express'
import { postDiscMsg } from './routes/msg'

export const jetspotterRouter = Router()

jetspotterRouter.post('/', postDiscMsg)