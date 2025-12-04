import { Router } from 'express'
import { client } from '../../bot'
import { EmbedBuilder, type TextChannel } from 'discord.js'

export const jetspotterRouter = Router()

type jsRes = {
  category: string
  embed: {
    color: number
    fields: { name:string, value:string, inline?:boolean }[]
    image?: { url: string } | undefined
    footer: { text: string }
  }
}


jetspotterRouter.post('/', async (req, res) => {
  try {
    const data:jsRes = req.body
    const channel = await client.channels.fetch('1392954356671975514') as TextChannel
    const embed = new EmbedBuilder({ ...data.embed })

    await channel.send({
      content: `:airplane: ${data.category} Aircraft Spotted! :airplane:`,
      embeds: [embed]
    })

    res.status(200).send('OK')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})