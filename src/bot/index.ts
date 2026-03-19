import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { Client, Collection, MessageFlags, ActivityType } from 'discord.js'
import { BotClient, BotCommand } from '../types'
import { env } from './config'
import { saveMessage, updateMessage, deleteMessage, formatMsgContent } from '../db/funcs'
import { isWhitelisted } from '~/utils'

export const client = new Client({ intents: ['Guilds', 'GuildMembers', 'GuildPresences', 'GuildMessages', 'MessageContent'] }) as BotClient
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


client.once('clientReady', () => {
  console.log(`Logged in as ${client.user!.username}.`)

  client.user?.setPresence({
    activities: [{
      type: ActivityType.Custom,
      name: 'custom status',
      state: 'I\'m up!'
    }],
    status:'online'
  })
})

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

export let lastOnline:string|null = null
client.on('presenceUpdate', (oldPresence, newPresence) => {
  if (newPresence.userId !== env.owner.id) return

  const onlineStatuses = ['online', 'idle', 'dnd']

  const oldStatus = oldPresence?.status ?? 'offline'
  const newStatus = newPresence.status ?? 'offline'

  if (onlineStatuses.includes(oldStatus) && !onlineStatuses.includes(newStatus)) lastOnline = new Date().toISOString()
  if (!onlineStatuses.includes(oldStatus) && onlineStatuses.includes(newStatus)) lastOnline = null
})

const channelMsgCache = new Map<string, { normalised:string; original:string; users:Set<string> }>()
client.on('messageCreate', async (msg) => {
  if (!msg.inGuild()) return
  if (!msg.author || msg.author.bot) return

  const parentId = msg.channel.isThread() ? msg.channel.parent?.parentId ?? null : 'parentId' in msg.channel ? msg.channel.parentId : null
  if (!isWhitelisted(msg.guild.id, msg.channel.id, parentId)) return

  const formatted = formatMsgContent(msg)
  if (!formatted) return
  saveMessage(msg, formatted)

  const channelId = msg.channel.id
  const normContent = formatted.toLowerCase()
  const cached = channelMsgCache.get(channelId)

  if (cached && cached.normalised === normContent) {
    cached.users.add(msg.author.id)
    if (cached.users.size === 3) {
      channelMsgCache.delete(channelId)
      try { await msg.channel.send(cached.original)
      } catch (error) { console.error(error) }
    }
  } else { channelMsgCache.set(channelId, { normalised:normContent, original:formatted, users:new Set([msg.author.id]) }) }
})
client.on('messageUpdate', (_oldMsg, newMsg) => { if (!newMsg.author?.bot) updateMessage(newMsg) })
client.on('messageDelete', (msg) => deleteMessage(msg) )


export async function startBot() { await client.login(env.bot.token) }