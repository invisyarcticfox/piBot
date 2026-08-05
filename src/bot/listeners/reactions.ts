import type { Client } from 'discord.js'
import { isWhitelistedChannel } from '../whitelist'


export function reactStuff(client:Client) {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return
    if (reaction.partial) try { await reaction.fetch() } catch { return }

    const message = reaction.message
    if (!message.inGuild()) return
    if (!message.channel.isTextBased()) return
    if (!isWhitelistedChannel(message.guild.id, message.channel)) return

    const { emoji } = reaction
    if (emoji.id && !message.guild.emojis.cache.has(emoji.id)) return

    const requiredVotes = emoji.name === '⭐' || emoji.name === '🍅' ? 5 : 3

    if ((reaction.count ?? 0) < requiredVotes) return
    if (reaction.me) return

    try { await message.react(emoji) } catch { }
  })
}