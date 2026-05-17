import express from 'express'
import { discordRouter } from './discord'
import { jetspotterRouter } from './jetspotter'
import { guestbookRouter } from './guestbook'
import { vrcRouter } from './vrchat'

export const app = express()
app.use(express.json())

app.use('/', discordRouter)
app.use('/jetspotter', jetspotterRouter)
app.use('/guestbook', guestbookRouter)
app.use('/vrchat', vrcRouter)