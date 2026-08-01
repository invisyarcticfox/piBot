import { readdir } from 'node:fs/promises'
import path from 'path'
import { pathToFileURL } from 'node:url'
import type { Command } from '~/types/djs'

async function getFiles(dir:string):Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })

  const files = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) return getFiles(fullPath)

      return [fullPath]
    })
  )

  return files.flat()
}

export async function loadCommands(dir:string):Promise<Command[]> {
  const commandFiles = await getFiles(dir)
  const commands: Command[] = []

  for (const file of commandFiles) {
    if (!['.js', '.ts'].some(ext => file.endsWith(ext))) continue

    const imported = await import(pathToFileURL(file).href)
    const command = imported.default?.default ?? imported.default

    if (!command?.data || !command?.execute) {
      console.warn(`Skipping invalid command: ${file}`)
      continue
    }

    commands.push(command)
  }

  return commands
}