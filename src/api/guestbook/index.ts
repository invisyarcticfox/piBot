import { Router } from 'express'
import { postDiscMsg } from './routes'

export const guestbookRouter = Router()
guestbookRouter.post('/', postDiscMsg)