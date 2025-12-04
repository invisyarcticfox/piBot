import { Router } from 'express'
import { client } from '../../bot'
import { EmbedBuilder, type TextChannel } from 'discord.js'

export const jetspotterRouter = Router()


jetspotterRouter.post('/', async (req, res) => {
  try {
    const data = req.body
    const channel = await client.channels.fetch('1392954356671975514') as TextChannel
    const embed = new EmbedBuilder().addFields(data.embed.fields).setFooter(data.embed.footer)

    await channel.send({
      content: `:airplane: ${data.category} Aircraft Spotted! :airplane:`,
      embeds: [embed]
    })

    res.status(200).send('OK')
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})