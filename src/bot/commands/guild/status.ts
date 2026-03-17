import process from 'process'
import { SlashCommandBuilder, type ChatInputCommandInteraction, version as djsVersion } from 'discord.js'
import { botStart } from '~/bot'


export default {
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