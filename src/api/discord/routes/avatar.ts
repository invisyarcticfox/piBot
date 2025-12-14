import type { Request, Response } from 'express'
import { fetchMember } from '../../../bot'
import { userId } from '../../../bot/config'


export async function getAvatar(req:Request, res:Response) {
  try {
    const member = await fetchMember(userId)
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