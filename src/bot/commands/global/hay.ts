import process from 'process'
import path from 'path'
import { SlashCommandBuilder, type ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js'
import type { Command } from '@types'


const hayCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('hay')
    .setDescription('hay'),


  async execute(interaction:ChatInputCommandInteraction) {
    const horseGif = path.join(process.cwd(), 'src/assets/HORSING.gif')
    const attachment = new AttachmentBuilder(horseGif)
    await interaction.reply({ files: [attachment] })
  }
}

export default hayCommand