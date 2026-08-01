import { Router, Request, Response } from 'express'
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel } from 'discord.js'
import { client } from '~/bot'
import { env } from '~/config'

export const jetspotter = Router()

const emotes = {
  adsbexchange: '1452673789069627552',
  flightradar24: '1452673884662009978',
  planespotters: '1452673905453043857',
  jetphotos: '1452673921097793607'
}
export type EmoteName = keyof typeof emotes


jetspotter.post('/', async (req:Request, res:Response) => {
  try {
    const { category, buttons, embed } = req.body
    const channel = await client.channels.fetch(env.JS_CHANNEL) as TextChannel
    const embeds = new EmbedBuilder(embed)

    const rows:ButtonBuilder[][] = [[], []]
    buttons.forEach((btn: { link:string; name:string; row:number }) => {
      if (!btn.link) return

      const button = new ButtonBuilder({
        label: `View on ${btn.name}`,
        style: ButtonStyle.Link,
        url: btn.link.trim(),
        emoji: emotes[btn.name.toLowerCase().slice(0, -4) as EmoteName],
      })
      rows[btn.row - 1].push(button)
    })
    const components = rows.filter(r => r.length > 0).map(r => new ActionRowBuilder<ButtonBuilder>().addComponents(r))

    await channel.send({
      content: `:airplane: ${category} Aircraft Spotted! :airplane:`,
      embeds: [embeds],
      components
    })

    res.sendStatus(201)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})