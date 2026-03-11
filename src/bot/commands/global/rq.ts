import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '~/types'
import { readRepeatedFile } from '~/utils'


const randQuoteCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('rq')
    .setDescription('return random repeated quotes sent by the bot'),


  async execute(interaction:ChatInputCommandInteraction) {
    const quotes = await readRepeatedFile()
    const q = quotes[Math.floor(Math.random() * quotes.length)]

    const link = `https://discord.com/channels/${interaction.guildId}/${q.channelId}/${q.messageId}`
    const unix = Math.floor(q.timestamp / 1000)

    const message = `"${q.content.replace(/"/g, "'")}" ${link} <t:${unix}:R>`
    await interaction.reply({ content: message })
  }
}

export default randQuoteCommand