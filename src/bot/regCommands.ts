import 'dotenv/config'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { serverCommands, guildCommands } from './commands'
import { token, guildId, botId } from '.'

const rest = new REST({ version: '10' }).setToken(token!);


(async () => {
  try {    
    console.log('Refreshing Global /slash commands.')
    await rest.put(
      Routes.applicationCommands(botId!),
      { body: serverCommands.map(cmd => cmd.toJSON()) }
    )
    console.log('Refreshed Global /slash commands!')
    
    console.log('Refreshing Server /slash commands.')
    await rest.put(
      Routes.applicationGuildCommands(botId!, guildId!),
      { body: guildCommands.map(cmd => cmd.toJSON()) }
    )
    console.log('Refreshed Server /slash commands!')
  } catch (error) {
    console.error(error)
  }
})()