import type { GuildBasedChannel } from 'discord.js'
import whitelistJson from '~conf/whitelist.json'

const whitelist = whitelistJson as {
  guilds: {
    id: string
    categories: string[]
    channels: string[]
  }[]
}


const whitelistMap = new Map(
  whitelist.guilds.map(g => [
    g.id,
    {
      categories: new Set(g.categories),
      channels: new Set(g.channels),
    }
  ])
)

export function isWhitelistedChannel(guildId: string, channel: GuildBasedChannel):boolean {
  const config = whitelistMap.get(guildId)
  if (!config) return false

  if (config.channels.has(channel.id)) return true

  return channel.parentId !== null && config.categories.has(channel.parentId)
}