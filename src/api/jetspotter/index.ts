import { Router } from 'express'
import { postDiscMsg } from './routes'

export const jetspotterRouter = Router()
jetspotterRouter.post('/', postDiscMsg)