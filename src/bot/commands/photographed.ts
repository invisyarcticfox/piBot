import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { readSeenFile } from '../../utils'
import { Command } from '../types'


export const photographedCommand:Command = {
  scope: 'GLOBAL',
  data: new SlashCommandBuilder()
    .setName('photographed')
    .setDescription('Lists all planes that have photos'),

  async execute(interaction:ChatInputCommandInteraction) {
    const data = await readSeenFile()

    const photoEntries = Object.values(data)
      .filter((entry) => entry.photographed)
      .map((entry) => `${entry.type} (*${entry.reg}*)`)

    const output = photoEntries.join('\n')
    await interaction.reply({ content: `**Photographed Entries (${photoEntries.length}):**\n${output}` })
  }
}
