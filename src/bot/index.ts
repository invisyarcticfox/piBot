import 'dotenv/config'
import { Client, Collection, ActivityType, MessageFlags, Partials } from 'discord.js'
import type { Command } from '~/types/djs'
import { env } from '~/config'
import { db } from '~/db/discord'
import { getCommands } from './commands'
import { setBotStart } from './state'
import { normaliseMsg } from './utils'
import { isWhitelistedChannel } from './whitelist'

export const client = new Client({
  intents: [ 'Guilds', 'GuildMembers', 'GuildPresences', 'GuildMessages', 'GuildMessageReactions', 'MessageContent' ],
  partials: [ Partials.Message, Partials.Channel, Partials.Reaction ]
})
const commandCollection = new Collection<string, Command>()


client.once('clientReady', () => {
  console.log('Logged in as', client.user?.username)

  client.user!.setPresence({
    activities: [{
      type: ActivityType.Custom,
      name: 'Custom Status',
      state: 'I\'m Online!'
    }],
    status: 'idle'
  })

  setBotStart(Date.now())
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.inGuild()) return

  const command = commandCollection.get(interaction.commandName)
  if (!command) return

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'Something went wrong.', flags: MessageFlags.Ephemeral })
  }
})

const repeatChains = new Collection<string, { normalised:string, firstMsg:string, auths:Set<string> }>()
client.on('messageCreate', async msg => {
  if (!msg.inGuild()) return
  if (msg.author.bot) return
  if (!isWhitelistedChannel(msg.guild.id, msg.channel)) return

  db.prepare(`
    UPDATE roulette
    SET
      points = points + CASE
        WHEN msgCount >= 4 THEN 1
        ELSE 0
      END,
      msgCount = CASE
        WHEN msgCount >= 4 THEN 0
        ELSE msgCount + 1
      END
    WHERE userId = ?
  `).run(msg.author.id)

  const content = [msg.content, ...msg.attachments.map(a => a.url)].filter(Boolean).join(' ')

  db.prepare(`
    INSERT INTO messages
    (guildId, channelId, messageId, userId, content, timestamp, repliedUser)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(msg.guild.id, msg.channel.id, msg.id, msg.author.id, content, msg.createdTimestamp, msg.mentions.repliedUser?.id ?? null)

  const normalised = normaliseMsg(content)
  let chain = repeatChains.get(msg.channel.id)
  if (!chain || chain.normalised !== normalised) return repeatChains.set(msg.channel.id, { normalised, firstMsg:content, auths:new Set([msg.author.id]) })
  if (chain.auths.has(msg.author.id)) return

  chain.auths.add(msg.author.id)
  if (chain.auths.size % 3 === 0) {
    repeatChains.delete(msg.channel.id)
    await msg.channel.send(chain.firstMsg)
  }
})
client.on('messageUpdate', (_oldMsg, newMsg) => { if (!newMsg.author.bot) db.prepare(`UPDATE messages SET content = ? WHERE messageId = ?`).run(newMsg.content, newMsg.id) })
client.on('messageDelete', msg => db.prepare(`DELETE FROM messages WHERE messageId = ?`).run(msg.id))
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return
  if (reaction.partial) try { await reaction.fetch() } catch { return }

  const message = reaction.message
  if (!message.inGuild()) return
  if (!message.channel.isTextBased()) return
  if (!isWhitelistedChannel(message.guild.id, message.channel)) return

  const { emoji } = reaction
  if (emoji.id && !message.guild.emojis.cache.has(emoji.id)) return

  const requiredVotes = emoji.name === '⭐' || emoji.name === '🍅' ? 5 : 3

  if ((reaction.count ?? 0) < requiredVotes) return
  if (reaction.me) return

  try { await message.react(emoji) } catch { }
})


export async function login() {
  const commands = await getCommands()
  for (const command of commands) commandCollection.set(command.data.name, command)

  await client.login(env.BOT_TOKEN)
}