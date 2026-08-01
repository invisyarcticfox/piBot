import { SlashCommandBuilder, ChatInputCommandInteraction, version } from 'discord.js'
import { botStart } from '~/bot/state'
import pkg from '~/../package.json'


export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('information and status'),

  async execute(interaction:ChatInputCommandInteraction) {
    const sent = Date.now()
    await interaction.reply({ content: 'Calculating latency...' })
    const latency = Date.now() - sent

    await interaction.editReply({
      content:
        `Started: **<t:${Math.floor(botStart / 1000)}:R>**\n` +
        `Bot version: **v${pkg.version}**\n` +
        `Discord.js version: **v${version}**\n` +
        `Latency: **${latency}ms**\n`
    })
  }
}