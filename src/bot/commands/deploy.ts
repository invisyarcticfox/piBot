import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { REST, Routes } from 'discord.js'
import { env } from '../config'

const rest = new REST({ version:'10' }).setToken(env.bot.token)


const globalCommands: any[] = []
const guildCommands: any[] = []

const globalPath = path.join(__dirname, 'global')
for (const file of fs.readdirSync(globalPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
  const command = require(path.join(globalPath, file)).default
  globalCommands.push(command.data.toJSON())
}

const guildPath = path.join(__dirname, 'guild')
for (const file of fs.readdirSync(guildPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
  const command = require(path.join(guildPath, file)).default
  guildCommands.push(command.data.toJSON())
}


;(async () => {
  try {
    console.log(`Deploying ${globalCommands.length} global commands`)
    await rest.put(Routes.applicationCommands(env.bot.id), { body: globalCommands })

    console.log(`Deploying ${guildCommands.length} guild commands`)
    await rest.put(Routes.applicationGuildCommands(env.bot.id, env.guild.id), { body: guildCommands })

    console.log('Commands deployed successfully')
  } catch (error) { console.error(error) }
})()