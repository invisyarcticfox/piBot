import { readFile } from 'fs/promises'


const filePth = '/home/lucas/scripts/jetspotter/data/seen.json'

export async function readSeenFile() {
  const raw = await readFile(filePth, 'utf-8')
  const data = JSON.parse(raw)
  return data
}