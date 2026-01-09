import { Command } from './types'
import { topCommand } from './commands/top'
import { restartCommand } from './commands/restart'
import { photographedCommand } from './commands/photographed'


const commands:Command[] = [restartCommand, topCommand, photographedCommand]

export const commandsMap = new Map(commands.map(cmd => [cmd.data.name, cmd]))
export const guildCommands = commands.filter(c => c.scope === 'GUILD').map(c => c.data)
export const globalCommands = commands.filter(c => c.scope === 'GLOBAL').map(c => c.data)