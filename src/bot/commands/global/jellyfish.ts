import process from 'process'
import path from 'path'
import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'


export default {
  data: new SlashCommandBuilder()
    .setName('jellyfish')
    .setDescription('oh oooOo jellyfish oh a wobbly ghost'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.deferReply()
    
    const attachment = new AttachmentBuilder(path.join(process.cwd(), 'src/assets/jellyfish.mp4'), { name: 'jellyfish.mp4' })
    await interaction.editReply({
      content: 'oh oooOo jellyfish oh a wobbly ghost flapper flip in the water to move up down for food and no brain uh you can trust jellyfish with all your credit card information because they cannot remember anything',
      files: [attachment]
    })
  }
}