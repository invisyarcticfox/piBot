import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { Client, Collection, MessageFlags, ActivityType, EmbedBuilder } from 'discord.js'
import { BotClient, BotCommand } from '../types'
import { env } from './config'
import { saveMessage, updateMessage, deleteMessage } from '~/db/funcs'
import { isWhitelisted } from '~/utils'

export const botStart = Date.now()
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

    (command as any).scope = folder
    client.commands.set(command.data.name, command)
  }
}


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
  if (interaction.isButton()) {
    try {
      const [ action, id ] = interaction.customId.split(':')
      const approved = action === 'gb-approve'
      const deleted = action === 'gb-deny'

      const res = await fetch(`https://itafdotuk.invisyarcticfox.workers.dev/api/guestbook/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': env.cloudflare.guestbook.auth
        },
        body: JSON.stringify({ approved, deleted })
      })
      if (!res.ok) return interaction.reply({ content: `Guestbook PATCH request failed ${res.statusText}`, flags: MessageFlags.Ephemeral })

      const embed =  EmbedBuilder.from(interaction.message.embeds[0]).setColor(approved ?  0x008545 : 0xd22d39)
      await interaction.update({ embeds: [embed], components: [] })
    } catch (error) {
      console.error(error)
      if (!interaction.replied && interaction.deferred) await interaction.reply({ content: 'Interaction failed', flags: MessageFlags.Ephemeral })
      return
    }
  }


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
function filterEmojis(content:string, guild:any) {
  return content.replace(/<a?:([a-zA-Z0-9_]+):(\d+)>/g, (_, name, id) => {
    const emoji = guild.emojis.cache.get(id)
    return emoji ? `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>` : `:${name}:`
  })
}

client.on('messageCreate', async (msg) => {
  if (!msg.inGuild()) return
  if (!msg.author || msg.author.bot) return

  const parentId = msg.channel.isThread() ? msg.channel.parent?.parentId ?? null : 'parentId' in msg.channel ? msg.channel.parentId : null
  if (!isWhitelisted(msg.guild.id, msg.channel.id, parentId)) return

  let content = msg.content?.trim() || ''
  if (msg.inGuild()) content = filterEmojis(content, msg.guild)

  const attachments = [...msg.attachments.values()].map(a => a.url.split('?ex=')[0])
  const formatted = content ? attachments.length ? `${content} ${attachments.join(' ')}` : content : attachments.join(' ')
  if (!formatted) return
  saveMessage(msg, formatted)

  const channelId = msg.channel.id
  const normContent = formatted.toLowerCase().replace(/<a?:([a-zA-Z0-9_]+):(\d+)>/g, (_, name) => `:${name}:`)
  const cached = channelMsgCache.get(channelId)

  if (cached && cached.normalised === normContent) {
    cached.users.add(msg.author.id)
    if (cached.users.size === 3) {
      channelMsgCache.delete(channelId)
      try { await msg.channel.send(cached.original)
      } catch (error) { console.error(error) }
    }
  } else {
    channelMsgCache.set(channelId, {
      normalised: normContent,
      original: formatted,
      users: new Set([msg.author.id])
    })
  }
})
client.on('messageUpdate', (_oldMsg, newMsg) => { if (!newMsg.author?.bot) updateMessage(newMsg) })
client.on('messageDelete', (msg) => deleteMessage(msg) )


export async function startBot() { await client.login(env.bot.token) }