import 'dotenv/config'
import { Client, GatewayIntentBits} from 'discord.js'
import express from 'express'
const token = process.env.BOT_TOKEN

const app = express()
const client = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences ]
})

client.once('clientReady', () => {
  console.log(`Logged in as ${client.user?.username}.`)

  const updateStatus = () => {
    const uptime = Date.now() - botStart
    const formatted = formatUptime(uptime)

    client.user?.setPresence({
      activities: [{
        name: `up for ${formatted}`,
        type: 3
      }],
      status: 'online'
    })
  }

  updateStatus()
  setInterval( updateStatus, 5 * 60 * 1000)
})

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const oldStatus = oldPresence?.status as string
  const newStatus = newPresence?.status as string
  const onlineStatuses = [ 'online', 'idle', 'dnd' ]
  
  if  (onlineStatuses.includes(oldStatus) && !onlineStatuses.includes(newStatus)) {
    lastOnline = new Date().toISOString()
  } else if (!onlineStatuses.includes(oldStatus) && onlineStatuses.includes(newStatus)) {
    lastOnline = null
  }
})


const guildId = '939964758805872650'
const userId = '470193291053498369'
let lastOnline:string|null = null

const botStart = Date.now()
function formatUptime(ms:number):string {
  const totalMinutes = Math.floor(ms / 60000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  const parts = []

  if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`)
  if (hours > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`)
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`)

  return parts.join(' ')
}


app.get('/discord', async (_req, res) => {
  try {
    let guild = client.guilds.cache.get(guildId)
    if (!guild) guild = await client.guilds.fetch(guildId)
    let member = guild.members.cache.get(userId)
    if (!member) member = await guild.members.fetch(guildId)

    const userInfo = {
      id: member.user.id,
      name: member.user.displayName,
      username: member.user.username,
      status: member.presence?.status ?? 'offline',
      lastOnline,
      avatar: member.user.displayAvatarURL({ size: 1024, extension: 'png' })
    }

    return res.json(userInfo )
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/discord/avatar', async (req, res) => {
  try {
    let guild = client.guilds.cache.get(guildId)
    if (!guild) guild = await client.guilds.fetch(guildId)
    let member = guild.members.cache.get(userId)
    if (!member) member = await guild.members.fetch(guildId)

    const allowedExts = [ 'png', 'jpg', 'jpeg', 'webp', 'gif' ]
    let format = (req.query.f as string)?.toLowerCase()
    if (!allowedExts.includes(format)) format = 'png'
    const avatarUrl = member.user.displayAvatarURL({ size: 1024, extension: format as any, forceStatic: format !== 'gif' })

    if ('r' in req.query) return res.redirect(avatarUrl)

    const img = await fetch(avatarUrl)
    const buffer = Buffer.from(await img.arrayBuffer())

    const imgType = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : `image/${format}`
    res.setHeader('Content-Type', imgType)
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.send(buffer)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})


app.listen(3621, () => { console.log('API running on port \'3621\'') })
client.login(token)
