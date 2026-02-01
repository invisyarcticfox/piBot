import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { SeenFile, gayStats } from './types'


const seenData = path.join(process.cwd(), 'data', 'seen.json')
const gayData = path.join(process.cwd(), 'data', 'gay.json')


export async function readSeenFile():Promise<SeenFile> {
  try {
    const raw = await readFile(seenData, 'utf-8')
    return JSON.parse(raw)
  } catch (error) { return {} }
}

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

export function formatUptime(ms:number):string {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)

  return [
    d && `${d}d`,
    h % 24 && `${h % 24}h`,
    m % 60 && `${m % 60}m`,
    s % 60 && `${s % 60}s`
  ].filter(Boolean).join(' ')
}