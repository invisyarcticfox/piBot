import { Router, Request, Response } from 'express'
import { MessageCreateOptions } from 'discord.js'
import { client } from '~/bot'
import { env } from '~/config'

export const message = Router()


message.post('/:channel', async (req:Request<{channel:string}, unknown, MessageCreateOptions>, res:Response) => {
  const { channel } = req.params

  try {
    if (typeof req.body.content !== 'string' && !Array.isArray(req.body.embeds)) return res.status(400).json({ error: 'Request must have content or embeds.', })

    const guild = client.guilds.cache.get(env.GUILD_ID) ?? await client.guilds.fetch(env.GUILD_ID)
    const dcCh = await guild.channels.fetch(channel)
    if (!dcCh?.isSendable()) return res.status(400).json({ error: 'Cannot send messages in this channel.', })
      
    const sent = await dcCh.send(req.body)
    return res.status(201).json({ messageId: sent.id, timestamp: sent.createdAt, })
  } catch (error) {
    console.error(error)
    return res.status(404).json({ error: 'Channel not found.', })
  }
})