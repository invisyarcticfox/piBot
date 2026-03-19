import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { getRandQuote } from '~/db/funcs'


export default {
  data: new SlashCommandBuilder()
    .setName('rq')
    .setDescription('Get a random quote from your messages')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('Get a quote from this user')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('anyone')
        .setDescription('Get a random quote from anyone')
        .setRequired(false)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const target = interaction.options.getUser('target')
    const anyone = interaction.options.getBoolean('anyone') ?? false


    let quote
    if (anyone) {
      quote = getRandQuote()
    } else {
      const userId = (target ?? interaction.user).id
      quote = getRandQuote(userId)
    }

    if (!quote) return interaction.reply({ content: 'No quotes found.', flags: MessageFlags.Ephemeral })


    let username = 'Unknown'
    try {
      const user = await interaction.client.users.fetch(quote.userId)
      username = user.username
    } catch { }


    let repliedText = ''
    if (quote.repliedUser) {
      try {
        const repliedUser = await interaction.client.users.fetch(quote.repliedUser)
        repliedText = ` *@${repliedUser.username}*`
      } catch { repliedText = `*Unknown* ` }
    }

    const timestamp = Math.floor(quote.timestamp / 1000)
    const output = `<t:${timestamp}:R> @${username}:${repliedText} ${quote.content}`

    await interaction.reply(output)
  }
}