import { Router, Request, Response } from 'express'
import { fetchMember } from '~/bot/utils'

export const users = Router()


users.get('/:id', async (req:Request<{id:string}>, res:Response) => {
  const { id } = req.params

  try {
    const member = await fetchMember(id)
    if (!member) return res.status(404).json({ error: 'User not found.' })

    return res.json({
      id: member.id,
      username: member.user.username,
      displayName: member.user.displayName,
      avatar: member.user.avatar,
      status: member.presence?.status ?? 'offline'
    })
  } catch (error) {
    console.error(error)
    return res.status(404).json({ error: 'User not found.' })
  }
})

users.get('/:id/avatar', async (req:Request<{id:string}>, res:Response) => {
  const { id } = req.params

  try {
    const user = await fetchMember(id)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    return res.redirect(308, user.displayAvatarURL({ extension: 'png', size: 1024 }))
  } catch (error) {
    console.error(error)
    return res.status(404).json({ error: 'User not found.' })
  }
})