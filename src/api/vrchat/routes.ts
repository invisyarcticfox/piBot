import 'dotenv/config'
import type { Request, Response } from 'express'
import {  EmbedBuilder, TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import { client } from '~/bot'
import { env } from '~/bot/config'
import type { vrcRes } from '~/types'


export async function postDiscMsg(req:Request, res:Response) {
  try {
    const { group, instances }:vrcRes = req.body
    if (!instances.length) res.status(200).send('No instances.')

    const channel = await client.channels.fetch(env.guild.channels.vrchat.id) as TextChannel
    const embeds = instances.map(instance => (
      new EmbedBuilder({
        color: 0x1f8b4c,
        fields: [
          { name: 'World', value: instance.worldName, inline: true },
          { name: 'Users', value: `${instance.userCount}/${instance.capacity ?? '?'}`, inline: true },
        ],
        footer: {
          text: `${group.name} - ${group.onlineMembers ?? 0}/${group.totalMembers ?? 0}`,
          icon_url: group.iconUrl
        }
      })
    ))
    const row = new ActionRowBuilder<ButtonBuilder>()
    instances.slice(0, 5).forEach((instance, i:number) => {
      row.addComponents(
        new ButtonBuilder({
          label: `Open World ${i + 1}`,
          style: ButtonStyle.Link,
          url: `https://vrchat.com/home/launch?worldId=${instance.worldId}&instanceId=${instance.instanceId}`
        })
      )
    })

    await channel.send({
      content: `**${group.name}** instance open!`,
      embeds,
      components: row.components.length ? [row] : []
    })

    res.status(200).send('OK')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}