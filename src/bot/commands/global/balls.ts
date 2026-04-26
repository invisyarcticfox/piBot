import process from 'process'
import path from 'path'
import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'


export default {
  data: new SlashCommandBuilder()
    .setName('balls')
    .setDescription('balls'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.deferReply()
    
    const attachment = new AttachmentBuilder(path.join(process.cwd(), 'src/assets/Balls.gif'), { name: 'Balls.gif' })
    await interaction.editReply({ files: [attachment] })
  }
}