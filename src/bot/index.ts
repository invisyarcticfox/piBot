import 'dotenv/config'
import { Client, Collection, ActivityType, MessageFlags, Partials } from 'discord.js'
import type { Command } from '~/types/djs'
import { env } from '~/config'
import { getCommands } from './commands'
import { setBotStart } from './state'
import { msgStuff, reactStuff } from './listeners'

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

client.on('error', error => console.error('Discord client error:', error))

msgStuff(client)
reactStuff(client)


export async function login() {
  const commands = await getCommands()
  for (const command of commands) commandCollection.set(command.data.name, command)

  await client.login(env.BOT_TOKEN)
}