import { statsCommand, restartCommand } from './commands/'
import { Command } from './types'

const commands:Command[] = [restartCommand, statsCommand]

export const commandsMap = new Map(commands.map(cmd => [cmd.data.name, cmd]))
export const guildCommands = commands.filter(c => c.scope === 'GUILD').map(c => c.data)
export const globalCommands = commands.filter(c => c.scope === 'GLOBAL').map(c => c.data)