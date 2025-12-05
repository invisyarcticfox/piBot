import { readFile } from 'fs/promises'
import { join } from 'path'


const filePth = join(process.cwd(), 'data/seen.json')

export async function readSeenFile() {
  const raw = await readFile(filePth, 'utf-8')
  const data = JSON.parse(raw)
  return data
}