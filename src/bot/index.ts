import 'dotenv/config'
import { Client, ActivityType } from 'discord.js'
import { env } from '~/config'

export const client = new Client({ intents: [ 'Guilds', 'GuildMembers', 'GuildPresences', 'GuildMessages', 'MessageContent' ] })


client.once('clientReady', () => {
  console.log('Logged in as', client.user?.username)

  client.user?.setPresence({
    activities: [{
      type: ActivityType.Custom,
      name: 'Custom Status',
      state: 'I\'m Online!'
    }],
    status: 'online'
  })
})


export async function login() {
  await client.login(env.BOT_TOKEN)
}