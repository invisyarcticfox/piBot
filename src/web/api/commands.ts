import { Router } from 'express'
import { REST, Routes, type RESTGetAPIApplicationCommandsResult, ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js'
import { env, conf } from '~/config'

export const commands = Router()
const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN)


commands.get('/', async (_req, res) => {
  try {
    const commands = await rest.get(Routes.applicationCommands(conf.BOT_ID)) as RESTGetAPIApplicationCommandsResult
    const cmds = commands.map(cmd => ({
      id: cmd.id,
      name: cmd.name,
      description: cmd.description,
      type: ApplicationCommandType[cmd.type],
      options: (cmd.options ?? []).map(opt => ({
        name: opt.name,
        description: opt.description,
        type: ApplicationCommandOptionType[opt.type],
        required: opt.required ?? false
      }))
    }))

    return res.json(cmds)
  } catch (error) {
    return res.status(404).json({ error: 'User not found.' })
  }
})