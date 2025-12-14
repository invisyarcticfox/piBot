import type { Request, Response } from 'express'
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js'
import { client } from '../../../bot'
import { channelId } from '../../../bot/config'
import type { jsRes } from '../../types'


export async function postDiscMsg(req:Request, res:Response) {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader || authHeader !== process.env.AUTH_KEY) return res.status(401).json({ error: 'Unauthorized.' })
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
}