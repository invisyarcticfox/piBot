import 'dotenv/config'
import { Client, GatewayIntentBits, ActivityType, type ChatInputCommandInteraction, type GuildMember } from 'discord.js'
import { commandsMap } from './commands'
import { userId, guildId, token } from './config'


export let lastOnline = new Map<string, string>()
export const botStart = Date.now()

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
})


client.once('clientReady', () => {
  const started = new Date(botStart)
  const startTime = started.toLocaleString('en-GB', { timeZone:'UTC', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:false})
  console.log(`Logged in as ${client.user!.username}.`)

  client.user?.setPresence({
    activities: [{
      type: ActivityType.Custom,
      name: 'custom status',
      state: `Online since ${startTime.replace(',','')} UTC`
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


export async function fetchMember(user:string=userId):Promise<GuildMember> {
  let guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId)
  let member = guild.members.cache.get(user) || await guild.members.fetch(user)
  return member
}

export async function startBot() { await client.login(token) }