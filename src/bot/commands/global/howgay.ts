import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { readGayFile } from '~/utils'


export default {
  data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('how many gay are you?')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('how gay is this person?')
        .setRequired(false)
    )
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
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const stats = await readGayFile()
    const sender = interaction.user
    const target = interaction.options.getUser('user') ?? sender
    const percent = interaction.options.getInteger('percent') ?? 100
    const categoryStats = stats[percent] ?? {}
    const amount = categoryStats[target.id] ?? 0
    await interaction.reply({ content: `${target} is **${percent}% gay** x${amount}` })
  }
}