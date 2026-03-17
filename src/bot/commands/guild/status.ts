import process from 'process'
import { SlashCommandBuilder, type ChatInputCommandInteraction, version as djsVersion } from 'discord.js'
import { botStart } from '~/bot'
import pkg from '../../../../package.json'


export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('return bot status'),

  async execute(interaction:ChatInputCommandInteraction) {
    const message =
      `Started: **<t:${Math.floor(botStart / 1000)}:R>**\n` +
      `Bot Version: **${pkg.version}**\n` +
      `Node.js version: **${process.version}**\n` +
      `Discord.js version: **${djsVersion}**`
    await interaction.reply({ content: message })
  }
}