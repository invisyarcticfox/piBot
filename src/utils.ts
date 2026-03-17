import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { gayStats } from './types'


const gayData = path.join(process.cwd(), 'data', 'gay.json')

export async function readGayFile():Promise<gayStats> {
  try {
    const raw = await readFile(gayData, 'utf-8')
    return JSON.parse(raw)
  } catch (error) { return { gay:{}, bi:{}, straight:{} }  }
}
export async function writeGayFile(stats:gayStats) {
  try {
    await writeFile(gayData, JSON.stringify(stats, null, 2), 'utf-8')
  } catch (error) { console.error(error) }
}
