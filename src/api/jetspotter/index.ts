import { Router } from 'express'
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, type TextChannel, ButtonStyle } from 'discord.js'
import { client, channelId } from '../../bot'

export const jetspotterRouter = Router()

type jsRes = {
  category: string
  embed: {
    color: string
    fields: { name:string, value:string, inline?:boolean }[]
    image?: { url: string } | undefined
    footer: { text: string }
  },
  buttons: { adsbexchange: string, planespotters?: string|undefined }
}


jetspotterRouter.post('/', async (req, res) => {
  try {
    const { category, buttons, embed }:jsRes = req.body
    const channel = await client.channels.fetch(channelId) as TextChannel
    
    const embeds = new EmbedBuilder({ ...embed, color: parseInt(embed.color.replace('#',''), 16) })
    const components = [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({
          label: 'View on ADS-B Exchange',
          style: ButtonStyle.Link,
          url: buttons.adsbexchange,
          emoji: '1446049316874489987'
        })
      ),
      ...(buttons.planespotters ? [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder({
            label: 'View on Planespotters.net',
            style: ButtonStyle.Link,
            url: buttons.planespotters,
            emoji: '1446326069283127417'
          })
        )
      ] : [] )
    ]

    await channel.send({
      content: `:airplane: ${category} Aircraft Spotted! :airplane:`,
      embeds: [embeds],
      components
    })

    res.status(200).send('OK')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})