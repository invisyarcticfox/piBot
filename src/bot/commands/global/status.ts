import { SlashCommandBuilder, type ChatInputCommandInteraction, version as djsVersion } from 'discord.js'
import process from 'process'
import type { Command } from '@types'
import { botStart } from '@bot'
import { formatUptime } from '@utils'


const statusCommand:Command = {
  scope: 'GLOBAL',
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('return bot status'),


  async execute(interaction:ChatInputCommandInteraction) {
    const uptimeMs = Date.now() - botStart
    const uptime = formatUptime(uptimeMs)
    const formatted = new Date(botStart).toLocaleString('en-GB', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    const message =
      `**Bot Status**\n` +
      `Uptime: **${uptime}**\n` +
      `Started: **${formatted}** (<t:${Math.floor(botStart / 1000)}:R>)\n` +
      `Node.js version: **${process.version}**\n` +
      `Discord.js version: **${djsVersion}**\n`
      // + `Bot version: *${pkg.version}*`
    await interaction.reply({ content: message })
  }
}

export default statusCommand