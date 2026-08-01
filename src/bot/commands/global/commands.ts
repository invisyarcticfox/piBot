import { SlashCommandBuilder, ChatInputCommandInteraction, REST, Routes, MessageFlags, type RESTGetAPIApplicationCommandsResult } from 'discord.js'
import { env, conf } from '~/config'

const rest = new REST({ version: '10' }).setToken(env.BOT_TOKEN)


export default {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('view available commands'),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const isDevGuild = interaction.guild?.id === env.GUILD_ID && interaction.user.id === conf.OWNER_ID
      const route = isDevGuild ? Routes.applicationGuildCommands(conf.BOT_ID, env.GUILD_ID) : Routes.applicationCommands(conf.BOT_ID)

      const commands = await rest.get(route) as RESTGetAPIApplicationCommandsResult
      const cmds = commands
        .filter(cmd => cmd.name !== interaction.commandName)
        .map((cmd, i) => {
          const lines = [`${i + 1}. **</${cmd.name}:${cmd.id}>** - ${cmd.description}`]

          const subcommands = cmd.options?.filter(opt => opt.type === 1)
          if (subcommands?.length) for (const sub of subcommands) lines.push(`  - **</${cmd.name} ${sub.name}:${cmd.id}>** - ${sub.description}`)

          return lines.join('\n')
        })

      const content = cmds.join('\n')
      if (content.length > 2000) return await interaction.reply({ content: 'Command list is too large to display.', flags: MessageFlags.Ephemeral, })

      return await interaction.reply({ content: content || 'No commands found.', })

    } catch (error) {
      console.error(error)
      return await interaction.reply({ content: 'Failed to load commands.', flags: MessageFlags.Ephemeral, })
    }
  }
}