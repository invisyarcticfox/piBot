import { readdirSync } from 'fs'
import path from 'path'
import type { Command } from '@types'


const globalCommands:Command[] = []
const guildCommands:Command[] = []

function load(scope:'global'|'guild') {
  const dir = path.join(__dirname, scope)
  const files = readdirSync(dir)

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.ts')) continue

    const command:Command = require(path.join(dir, file)).default

    if (scope === 'global') { globalCommands.push(command)
    } else { guildCommands.push(command) }
  }
}

load('global')
load('guild')

export const commandsMap = new Map([...globalCommands, ...guildCommands].map(cmd => [cmd.data.name, cmd]))
export const globalSlashCommands = globalCommands.map(c => c.data)
export const guildSlashCommands = guildCommands.map(c => c.data)