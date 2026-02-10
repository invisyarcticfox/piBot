import 'dotenv/config'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { globalSlashCommands, guildSlashCommands } from './commands'
import { token, botId, guildId } from './config'

const rest = new REST({ version:'10' }).setToken(token!);


(async () => {
  try {    
    await rest.put( Routes.applicationCommands(botId!), { body:globalSlashCommands.map(cmd => cmd.toJSON()) } )
    console.log('Refreshed Global /slash commands!')
    
    await rest.put( Routes.applicationGuildCommands(botId!, guildId!), { body:guildSlashCommands.map(cmd => cmd.toJSON()) } )
    console.log('Refreshed Guild /slash commands!')
  } catch (error) { console.error(error) }
})()