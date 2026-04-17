import process from 'process'
import path from 'path'
import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'


export default {
  data: new SlashCommandBuilder()
    .setName('nineeleven')
    .setDescription('ohhh nine eleven ohh ohhh nine eleven.'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.deferReply()
    
    const attachment = new AttachmentBuilder(path.join(process.cwd(), 'src/assets/911.mp4'), { name: '911.mp4' })
    await interaction.editReply({ files: [attachment] })
  }
}