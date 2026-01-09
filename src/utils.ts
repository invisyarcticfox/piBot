import { readFile } from 'fs/promises'
import { join } from 'path'
import { SeenFile } from './bot/types'


const filePth = join(process.cwd(), 'data/seen.json')

export async function readSeenFile():Promise<SeenFile> {
  const raw = await readFile(filePth, 'utf-8')
  const data = JSON.parse(raw)
  return data
}