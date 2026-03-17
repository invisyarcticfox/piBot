import 'dotenv/config'
import { Client, Collection, MessageFlags } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { env } from './config'
import { BotClient, BotCommand } from '../types'


export async function startBot() {
  const client = new Client({ intents: [ 'Guilds', 'GuildMembers', 'GuildPresences', 'GuildMessages', 'MessageContent' ] }) as BotClient

  client.commands = new Collection<string, BotCommand>()

  const commandsPath = path.join(__dirname, 'commands')
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file)).default as BotCommand
    client.commands.set(command.data.name, command)
  }

  client.once('clientReady', () => { console.log(`Logged in as ${client.user?.tag}!`) })

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: 'Error executing command.', flags: MessageFlags.Ephemeral })
    }
  })

  await client.login(env.bot.token)
  return client
}