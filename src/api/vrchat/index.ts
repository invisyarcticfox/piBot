import { Router } from 'express'
import { postDiscMsg } from './routes'

export const vrcRouter = Router()
vrcRouter.post('/', postDiscMsg)