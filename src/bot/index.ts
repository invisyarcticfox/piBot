import 'dotenv/config'
import { Client, GatewayIntentBits, ActivityType, type ChatInputCommandInteraction, type GuildMember } from 'discord.js'
import { commandsMap } from './commands'
import { userId, guildId, token } from './config'
import { AddRepeatedMessage } from '~/utils'


export let lastOnline = new Map<string, string>()
export const botStart = Date.now()

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})


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

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const userId = newPresence.userId
  const onlineStatuses = ['online', 'idle', 'dnd']
  const oldStatus = oldPresence?.status ?? 'offline'
  const newStatus = newPresence.status ?? 'offline'

  if (onlineStatuses.includes(oldStatus) && !onlineStatuses.includes(newStatus)) {
    lastOnline.set(userId, new Date().toISOString())
  }
  if (!onlineStatuses.includes(oldStatus) && onlineStatuses.includes(newStatus)) {
    lastOnline.delete(userId)
  }
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  const command = commandsMap.get(interaction.commandName)
  if (!command) return

  try { await command.execute(interaction as ChatInputCommandInteraction)
  } catch (error) { console.error(error) }
})


const channelMessageCache = new Map<string, { normalised:string, original:string, users:Set<string> }>()

client.on('messageCreate', async (message) => {
  if (!message.guild) return
  if (message.author.bot) return

  const channelId = message.channel.id
  const content = message.content.trim()
  if (!content) return

  const normContent = content.toLowerCase()
  const cached = channelMessageCache.get(channelId)

  if (cached && cached.normalised === normContent) {
    cached.users.add(message.author.id)

    if (cached.users.size === 3) {
      const sent = await message.channel.send(cached.original)
      await AddRepeatedMessage({
        channelId: sent.channel.id,
        messageId: sent.id,
        timestamp: Date.now(),
        content: cached.original
      })
      channelMessageCache.delete(channelId)
    }
  } else {
    channelMessageCache.set(channelId, {
      normalised: normContent,
      original: content,
      users: new Set([message.author.id])
    })
  }
})


export async function fetchMember(user:string=userId):Promise<GuildMember> {
  let guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId)
  let member = guild.members.cache.get(user) || await guild.members.fetch(user)
  return member
}

export async function startBot() { await client.login(token) }