import { Guild, GuildMember } from 'discord.js'
import { client } from '~/bot'
import { db } from '~/db/discord'


export async function fetchMember(id:string, guild?:Guild):Promise<GuildMember|null> {
  if (guild) {
    const cached = guild.members.cache.get(id)
    if (cached) return cached

    try { return await guild.members.fetch(id)
    } catch { return null }
  }

  for (const guild of client.guilds.cache.values()) {
    const cached = guild.members.cache.get(id)
    if (cached) return cached

    try { return await guild.members.fetch(id)
    } catch { return null }
  }

  return null
}

export function normaliseMsg(content:string):string {
  return content
    .trim()
    .replace(/<a?:([a-zA-Z0-9_]+):\d+>/g, ':$1:')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}