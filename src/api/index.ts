import express from 'express'
import { discordRouter } from './discord'
import { jetspotterRouter } from './jetspotter'

export const app = express()
app.use(express.json())


app.use('/discord', discordRouter)
app.use('/jetspotter', jetspotterRouter)