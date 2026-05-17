import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'


export default {
  data: new SlashCommandBuilder()
    .setName('blehhhh')
    .setDescription('blehhhh'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.reply({ content: '<:blehhhh:1503158647612510258>' })
  }
}