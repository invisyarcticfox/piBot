import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { readGayFile } from '~/utils'


export default {
  data: new SlashCommandBuilder()
    .setName('gaytop')
    .setDescription('show top gays')
    .addIntegerOption(option =>
      option
        .setName('percent')
        .setDescription('how gay to view')
        .setRequired(false)
        .addChoices(
          { name: '100% gay', value: 100 },
          { name: '50% gay', value: 50 },
          { name: '0% gay', value: 0 }
        )
    )
    .addIntegerOption(option =>
      option
        .setName('count')
        .setDescription('how many gays to show')
        .setRequired(false)
        .setMinValue(5)
        .setMaxValue(30)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const stats = await readGayFile()
    const percent = interaction.options.getInteger('percent') ?? 100
    const count = interaction.options.getInteger('count') ?? 5
    const categoryStats = stats[percent] ?? {}

    const sorted = Object.entries(categoryStats).sort(([, a], [, b]) => b - a).slice(0, count)

    if (sorted.length === 0) {
      await interaction.reply({ content: `No users recorded for ${percent}% yet..` })
      return
    }

    const lines = await Promise.all(
      sorted.map(async ([id, amount], i) => {
        const user = await interaction.client.users.fetch(id).catch(() => null)
        return `${i + 1}. ${user?.username ?? 'Unknown'} is **${percent}% gay** x${amount}`
      })
    )

    await interaction.reply({ content: `**Top ${sorted.length} users (${percent}% gay)**\n${lines.join('\n')}` })
  }
}