import { Router } from 'express'
import { getUser, getAvatar } from './routes'

export const discordRouter = Router()

discordRouter.get('/', getUser)
discordRouter.get('/avatar', getAvatar)