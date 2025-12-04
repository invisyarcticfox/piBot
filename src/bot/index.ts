import 'dotenv/config'
import { ActivityType, Client, GatewayIntentBits, type GuildMember } from 'discord.js'

const token = process.env.BOT_TOKEN
const guildId = '939964758805872650'
export const userId = '470193291053498369'
export let lastOnline:string|null = null
export const botStart = new Date(Date.now()).toLocaleString('en-GB', { timeZone: 'UTC' })

export const client = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences ]
})


client.once('clientReady', () => {
  console.log(`Logged in as ${client.user!.username}.`)
  client.user?.setPresence({
    activities: [{
      type: ActivityType.Custom,
      name: 'custom status',
      state: `Online since ${botStart.slice(0,-3)} UTC`
    }],
    status:'online'
  })
})

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const oldStatus = oldPresence?.status ?? 'offline'
  const newStatus = newPresence?.status as string
  const onlineStatuses = [ 'online', 'idle', 'dnd' ]
  
  if  (onlineStatuses.includes(oldStatus) && !onlineStatuses.includes(newStatus)) {
    lastOnline = new Date().toISOString()
  } else if (!onlineStatuses.includes(oldStatus) && onlineStatuses.includes(newStatus)) {
    lastOnline = null
  }
})


export async function fetchMember(user:string=userId):Promise<GuildMember> {
  let guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId)
  let member = guild.members.cache.get(user) || await guild.members.fetch(user)
  return member
}

export async function startBot() { await client.login(token) }