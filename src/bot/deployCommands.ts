import 'dotenv/config'
import { REST, Routes } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { env } from './config'

const rest = new REST({ version:'10' }).setToken(env.bot.token)


const commands:any[] = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file)).default
  commands.push(command.data.toJSON())
}

;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} commands.`)
    await rest.put(
      Routes.applicationGuildCommands(env.bot.id, env.guild.id),
      { body: commands }
    )
    console.log('Successfully reloaded application (slash) commands.')
  } catch (error) { console.error(error) }
})()