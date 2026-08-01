import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.reply('pong')
  }
}