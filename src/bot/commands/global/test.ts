import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '~/types'
import { userId } from '~/bot/config'

const testCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),

  async execute(interaction:ChatInputCommandInteraction) {
    const user = interaction.user

    if (user.id !== userId) await interaction.reply({ content: 'you can\'t run this command', flags: MessageFlags.Ephemeral })
    else await interaction.reply({ content: 'test', flags: MessageFlags.Ephemeral })
    // await member?.timeout(15_000, '15 seconds.')
  }
}

export default testCommand