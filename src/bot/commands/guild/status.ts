import process from 'process'
import path from 'path'
import { SlashCommandBuilder, type ChatInputCommandInteraction, version as djsVersion } from 'discord.js'
import { botStart } from '~/bot'


export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('return bot status'),

  async execute(interaction:ChatInputCommandInteraction) {
    const pkg = JSON.parse(path.resolve(path.join(process.cwd(), 'package.json'), 'utf-8'))
    const content =
      `Started: **<t:${Math.floor(botStart / 1000)}:R>**\n` +
      `Bot Version: **${pkg.version}**\n` +
      `Node.js version: **${process.version}**\n` +
      `Discord.js version: **${djsVersion}**`
    await interaction.reply({ content })
  }
}