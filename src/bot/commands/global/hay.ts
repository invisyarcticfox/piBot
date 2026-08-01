import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'
import process from 'process'
import path from 'path'


export default {
  data: new SlashCommandBuilder()
    .setName('hay')
    .setDescription('hay'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.deferReply()
    
    const attachment = new AttachmentBuilder(path.join(process.cwd(), 'src/bot/assets/HORSING.gif'), { name: 'HORSING.gif' })
    await interaction.editReply({ files: [attachment] })
  }
}