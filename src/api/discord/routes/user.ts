import type { Request, Response } from 'express'
import { fetchMember, lastOnline } from '../../../bot'
import { userId } from '../../../bot/config'


export async function getUser(_req:Request, res:Response) {
  try {
    const member = await fetchMember(userId)
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