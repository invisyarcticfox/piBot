import { readdirSync } from 'fs'
import path from 'path'
import type { Command } from '@types'

const commands:Command[] = []
function load(scope:'global'|'guild') {
  const dir = path.join(__dirname, scope)
  const files = readdirSync(dir)

  for (const file of files) {
    if (!file.endsWith('.js') && !file.endsWith('.ts')) continue
    const command:Command = require(path.join(dir, file)).default
    commands.push(command)
  }
}


load('global')
load('guild')

export const commandsMap = new Map(commands.map(cmd => [cmd.data.name, cmd]))
export const globalCommands = commands.filter(c => c.scope === 'GLOBAL').map(c => c.data)
export const guildCommands = commands.filter(c => c.scope === 'GUILD').map(c => c.data)