import { Router } from 'express'
import { getAvatar } from './routes/avatar'
import { getUser } from './routes/user'

export const discordRouter = Router()

discordRouter.get('/', getUser)
discordRouter.get('/avatar', getAvatar)