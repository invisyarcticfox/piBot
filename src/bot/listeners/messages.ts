import { type Client, Collection } from 'discord.js'
import { db } from '~/db/discord'
import { normaliseMsg } from '../utils'
import { isWhitelistedChannel } from '../whitelist'


const repeatChains = new Collection<string, { normalised:string, firstMsg:string, auths:Set<string> }>()

export function msgStuff(client:Client) {
  client.on('messageCreate', async msg => {
    if (!msg.inGuild()) return
    if (msg.author.bot) return
    if (!isWhitelistedChannel(msg.guild.id, msg.channel)) return

    db.prepare(`
      UPDATE roulette
      SET
        points = points + CASE
          WHEN msgCount >= 4 THEN 1
          ELSE 0
        END,
        msgCount = CASE
          WHEN msgCount >= 4 THEN 0
          ELSE msgCount + 1
        END
      WHERE userId = ?
    `).run(msg.author.id)

    const content = [msg.content, ...msg.attachments.map(a => a.url)].filter(Boolean).join(' ')

    db.prepare(`
      INSERT INTO messages
      (guildId, channelId, messageId, userId, content, timestamp, repliedUser)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(msg.guild.id, msg.channel.id, msg.id, msg.author.id, content, msg.createdTimestamp, msg.mentions.repliedUser?.id ?? null)
  
    const normalised = normaliseMsg(content)
    let chain = repeatChains.get(msg.channel.id)
    if (!chain || chain.normalised !== normalised) return repeatChains.set(msg.channel.id, { normalised, firstMsg:content, auths:new Set([msg.author.id]) })
    if (chain.auths.has(msg.author.id)) return

    chain.auths.add(msg.author.id)
    if (chain.auths.size % 3 === 0) {
      repeatChains.delete(msg.channel.id)
      try { await msg.channel.send(chain.firstMsg) } catch (error) { console.error('Failed to send repeated message:', error) }
    }
  })

  client.on('messageUpdate', (_oldMsg, newMsg) => { if (!newMsg.author.bot) db.prepare(`UPDATE messages SET content = ? WHERE messageId = ?`).run(newMsg.content, newMsg.id) })
  client.on('messageDelete', msg => db.prepare(`DELETE FROM messages WHERE messageId = ?`).run(msg.id))
}