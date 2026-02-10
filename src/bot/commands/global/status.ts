import { SlashCommandBuilder, type ChatInputCommandInteraction, version as djsVersion } from 'discord.js'
import process from 'process'
import type { Command } from '@types'
import { botStart } from '@bot'


const statusCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('return bot status'),


  async execute(interaction:ChatInputCommandInteraction) {
    const message =
      `**Bot Status**\n` +
      `Started: **<t:${Math.floor(botStart / 1000)}:R>**\n` +
      `Node.js version: **${process.version}**\n` +
      `Discord.js version: **${djsVersion}**\n`
    await interaction.reply({ content: message })
  }
}

export default statusCommand