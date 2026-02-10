import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { readSeenFile } from '@utils'
import { Command, SeenFile } from '@types'


const photographedCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('photographed')
    .setDescription('Lists all planes that have photos'),

  async execute(interaction:ChatInputCommandInteraction) {
    const data:SeenFile = await readSeenFile()

    const photoEntries = Object.values(data)
      .filter((entry) => entry.photographed)
      .map((entry) => `${entry.type} (*${entry.reg}*)`)

    const output = photoEntries.join('\n')
    await interaction.reply({ content: `**Photographed Entries (${photoEntries.length}):**\n${output}` })
  }
}

export default photographedCommand