import { REST, Routes } from 'discord.js'
import { env, conf } from '~/config'
import { getGuildCommands, getGlobalCommands } from '.'

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN)


;(async () => {
  try {
    const guildCommands = await getGuildCommands()
    const globalCommands = await getGlobalCommands()

    console.log(`Deploying ${guildCommands.length} guild commands...`)
    await rest.put(
      Routes.applicationGuildCommands(conf.BOT_ID, env.GUILD_ID),
      { body: guildCommands.map(command => command.data.toJSON()) }
    )

    console.log(`Deploying ${globalCommands.length} global commands...`)
    await rest.put(
      Routes.applicationCommands(conf.BOT_ID),
      { body: globalCommands.map(command => command.data.toJSON()) }
    )

    console.log(`Deployed ${guildCommands.length} guild and ${globalCommands.length} global commands.`)
  } catch (error) { console.error(error) }
})()