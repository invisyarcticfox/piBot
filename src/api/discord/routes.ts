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

export async function getAvatar(req:Request, res:Response) {
  try {
    const guild = client.guilds.cache.get(env.guild.id) ?? await client.guilds.fetch(env.guild.id)
    const member = guild.members.cache.get(env.owner.id) ?? await guild.members.fetch(env.owner.id)
    
    const allowedExts = ['png', 'jpg', 'jpeg', 'webp', 'gif']
    let format = (req.query.f as string || req.query.format as string)?.toLowerCase()
    if (!allowedExts.includes(format)) format = 'png'

    const avatarUrl = member.user.displayAvatarURL({
      size: 1024,
      extension: format as any,
      forceStatic: format !== 'gif'
    })

    if ('r' in req.query || 'redirect' in req.query) return res.status(308).redirect(avatarUrl)

    const img = await fetch(avatarUrl)
    const buffer = Buffer.from(await img.arrayBuffer())

    res.setHeader('Content-Type', format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : `image/${format}`)
    res.setHeader('Cache-Control', 'public, max-age=1800')
    return res.status(200).send(buffer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}