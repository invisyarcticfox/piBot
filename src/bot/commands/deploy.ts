import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { REST, Routes } from 'discord.js'
import { env } from '../config'

function getCommandFiles(dir:string):string[] {
  let results:string[] = []

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      const indexTs = path.join(fullPath, 'index.ts')
      const indexJs = path.join(fullPath, 'index.js')

      if (fs.existsSync(indexTs)) results.push(indexTs)
      else if (fs.existsSync(indexJs)) results.push(indexJs)
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(fullPath)
    }
  }

  return results
}

const rest = new REST({ version: '10' }).setToken(env.bot.token)


;(async () => {
  try {
    const globalCommands = getCommandFiles(path.join(__dirname, 'global')).map(f => require(f).default.data.toJSON())
    const guildCommands = getCommandFiles(path.join(__dirname, 'guild')).map(f => require(f).default.data.toJSON())

    console.log(`Deploying ${globalCommands.length} global commands`)
    await rest.put(Routes.applicationCommands(env.bot.id), { body: globalCommands })

    console.log(`Deploying ${guildCommands.length} guild commands`)
    await rest.put(Routes.applicationGuildCommands(env.bot.id, env.guild.id), { body: guildCommands })

    console.log('Commands deployed successfully')
  } catch (error) { console.error(error) }
})()