import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { RepeatedMessageEntry, RepeatedMessageFile, SeenFile, gayStats } from './types'


const seenData = path.join(process.cwd(), 'data', 'seen.json')
const gayData = path.join(process.cwd(), 'data', 'gay.json')
const repeatedData = path.join(process.cwd(), 'data', 'repeated.json')


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
  } catch (error) { return { gay:{}, bi:{}, straight:{} }  }
}
export async function writeGayFile(stats:gayStats) {
  try {
    await writeFile(gayData, JSON.stringify(stats, null, 2), 'utf-8')
  } catch (error) { console.error(error) }
}

export async function readRepeatedFile():Promise<RepeatedMessageFile> {
  try {
    const raw = await readFile(repeatedData, 'utf-8')
    return JSON.parse(raw)
  } catch (error) { return []  }
}
export async function writeRepeatedFile(stats:RepeatedMessageFile) {
  try {
    await writeFile(repeatedData, JSON.stringify(stats, null, 2), 'utf-8')
  } catch (error) { console.error(error) }
}
export async function AddRepeatedMessage(entry:RepeatedMessageEntry) {
  const file = await readRepeatedFile()
  file.push(entry)
  await writeRepeatedFile(file)
}