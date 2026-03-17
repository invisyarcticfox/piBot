import type { Request, Response } from 'express'
import { client, lastOnline } from '~/bot'
import { env } from '~/bot/config'


export async function getUser(_req:Request, res:Response) {
  try {
    const guild = client.guilds.cache.get(env.guild.id) ?? await client.guilds.fetch(env.guild.id)
    const member = guild.members.cache.get(env.owner.id) ?? await guild.members.fetch(env.owner.id)

    res.status(200).json({
      id: member.user.id,
      name: member.user.globalName,
      username: member.user.username,
      status: member.presence?.status ?? 'offline',
      lastOnline,
      avatar: member.user.displayAvatarURL({ size: 1024, extension: 'png' })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}