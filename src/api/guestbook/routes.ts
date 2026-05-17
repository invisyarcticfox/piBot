import 'dotenv/config'
import type { Request, Response } from 'express'
import {  EmbedBuilder, TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import { client } from '~/bot'
import { env } from '~/bot/config'
import type { GbRes } from '~/types'


export async function postDiscMsg(req:Request, res:Response) {
  try {
    const { id, name, message, timestamp }:GbRes = req.body
    const auth = req.header('Authorization')
    if (!auth || auth !== env.cloudflare.guestbook.auth) return res.status(401).json({ error: 'Unauthorized' })

    const channel = await client.channels.fetch(env.guild.channels.guestbook.id) as TextChannel
    const embed = new EmbedBuilder({
      fields: [
        { name: 'Name', value: name?.trim() || 'Anon', inline: true },
        { name: 'Timestamp', value: `<t:${Math.floor(new Date(timestamp).getTime() / 1000)}:f>`, inline: true },
        // { name: 'Id', value: id, inline: true },
        { name: 'Message', value: message.trim() }
      ],
      footer: {
        icon_url: 'https://cdn.discordapp.com/emojis/1503027697692049549',
        text: id
      }
    })
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder({ customId: `gb-approve:${id}`, label: 'Approve', style: ButtonStyle.Success }),
      new ButtonBuilder({ customId: `gb-deny:${id}`, label: 'Deny', style: ButtonStyle.Danger }),
    )

    await channel.send({
      content: `Guestbook entry!`,
      embeds: [embed],
      components: [row]
    })

    res.status(200).send('OK')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}