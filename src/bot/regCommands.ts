import 'dotenv/config'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { commands } from './commands'
import { token, guildId, botId } from '.'

const rest = new REST({ version: '10' }).setToken(token!);

(async () => {
  try {
    console.log('Refreshing /slash commands.')

    await rest.put(
      Routes.applicationGuildCommands(botId!, guildId!),
      { body: commands.map(cmd => cmd.toJSON()) }
    )

    console.log('Refreshed /slash commands!')
  } catch (error) {
    console.error(error)
  }
})()