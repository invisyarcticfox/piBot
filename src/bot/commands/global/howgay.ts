import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '@types'
import { readGayFile } from '@utils'

const howGayCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('how many gay are you?')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('how many gay is this person?')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('top')
        .setDescription('show top users')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('how gay to view?')
        .setRequired(false)
        .addChoices(
          { name: '100% gay', value: 'gay' },
          { name: '50% gay', value: 'bi' },
          { name: '0% gay', value: 'straight' }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('count')
        .setDescription('how many gays to return?')
        .setRequired(false)
        .setMinValue(5)
        .setMaxValue(30)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const stats = await readGayFile()
    const sender = interaction.user
    const userOpt = interaction.options.getUser('user')
    const topOpt = interaction.options.getBoolean('top')
    const countOpt = interaction.options.getInteger('count')

    const category = (interaction.options.getString('category') as keyof typeof stats) ?? 'gay'
    const categoryStats = stats[category]
    const percents: Record<keyof typeof stats, number> = { gay: 100, bi: 50, straight: 0 }

    if (topOpt) {
      const sorted = Object.entries(categoryStats).sort(([, a], [, b]) => b - a).slice(0, countOpt ?? 5)

      if (sorted.length === 0) {
        await interaction.reply({ content: `No users recorded for ${percents[category]}% gay yet.` })
        return
      }

      const lines = await Promise.all(
        sorted.map(async ([id, amount], i) => {
          const user = await interaction.client.users.fetch(id).catch(() => null)
          const name = user?.username ?? 'Unknown User'
          return `${i + 1}. ${name} is **${percents[category]}% gay** x${amount}`
        })
      )

      const message =
        `**Top ${sorted.length} users (${percents[category]}% gay)**\n` +
        lines.join('\n')

      await interaction.reply({ content: message })
    } else {
      const target = userOpt ?? sender
      const amount = categoryStats[target.id] ?? 0
      await interaction.reply({ content: `${target} is **${percents[category]}% gay** x${amount}` })
    }
  }
}

export default howGayCommand