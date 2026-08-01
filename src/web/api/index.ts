import { Router } from 'express'
import { users } from './users'
import { commands } from './commands'
import { message } from './message'
import { jetspotter } from './jetspotter'

export const api = Router()


api.use('/users', users)
api.use('/commands', commands)
api.use('/message', message)
api.use('/jetspotter', jetspotter)