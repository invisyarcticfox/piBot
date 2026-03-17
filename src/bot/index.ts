import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { Client, Collection, MessageFlags } from 'discord.js'
import { BotClient, BotCommand } from '../types'
import { env } from './config'
import { saveMessage, updateMessage, deleteMessage } from './db/funcs'


const client = new Client({ intents: ['Guilds', 'GuildMembers', 'GuildPresences', 'GuildMessages', 'MessageContent'] }) as BotClient
client.commands = new Collection<string, BotCommand>()
const commandsPath = path.join(__dirname, 'commands')
const folders = ['global', 'guild']

for (const folder of folders) {
  const folderPath = path.join(commandsPath, folder)
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file)
    const command = require(filePath).default as BotCommand
    if (!command?.data || !command?.execute) {
      console.warn(`Invalid command file: ${filePath}`)
      continue
    }
    client.commands.set(command.data.name, command)
  }
}

export const botStart = Date.now()


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

client.on('messageCreate', (msg) => { if (!msg.author?.bot) saveMessage(msg) })
client.on('messageUpdate', (_oldMsg, newMsg) => { if (!newMsg.author?.bot) updateMessage(newMsg) })
client.on('messageDelete', (msg) => { deleteMessage(msg) })


export async function startBot() { await client.login(env.bot.token) }