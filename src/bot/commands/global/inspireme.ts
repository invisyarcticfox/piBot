import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'


export default {
  data: new SlashCommandBuilder()
    .setName('insprireme')
    .setDescription('get inspired'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.deferReply()

    try {
      const res = await fetch('https://inspirobot.me/api?generate=true')
      const d = await res.text()
      const attachment = new AttachmentBuilder(d, { name: 'inspiration.jpg' })
      await interaction.editReply({ files: [attachment] })
    } catch (error) {
      console.error(error)
      await interaction.editReply('something went wrong. yell at <@470193291053498369>.')
    }
  }
}