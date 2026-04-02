import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { gayStats } from './types'
import whitelist from '~/whitelist.json'


const gayData = path.join(process.cwd(), 'data', 'gay.json')

export async function readGayFile():Promise<gayStats> {
  try {
    const raw = await readFile(gayData, 'utf-8')
    return JSON.parse(raw)
  } catch (error) { return {}  }
}
export async function writeGayFile(stats:gayStats) {
  try {
    await writeFile(gayData, JSON.stringify(stats, null, 2), 'utf-8')
  } catch (error) { console.error(error) }
}


export function isWhitelisted(guildId:string, channelId:string, parentId:string|null|undefined):boolean {
  const guild = whitelist.guilds.find(g => g.id === guildId)
  if (!guild) return false

  if (guild.channels?.includes(channelId)) return true
  if (parentId && guild.categories?.includes(parentId)) return true

  return false
}