import express from 'express'
import { botStart } from '~/bot/state'
import { api } from './api'

export const web = express()

web.use(express.json(), express.text(), express.static(__dirname))


web.get('/', (_req, res) => res.json({ online: true, started: new Date(botStart).toISOString() }) )
web.use('/', api)