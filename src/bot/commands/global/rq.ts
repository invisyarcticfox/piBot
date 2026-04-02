import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { getRandQuote } from '~/db/funcs'

function parseTimeframe(input?:string):{start?:number, end?:number} {
  if (!input) return {}

  const now = Date.now()
  input = input.toLowerCase().trim()

  const match = input.match(/^(\d+)(h|d)$/)
  if (match) {
    const value = Number(match[1])
    const unit = match[2]
    const ms = unit === 'h' ? value * 60 * 60 * 1000 : value * 24 * 60 * 60 * 1000

    return { start: now - ms, end: now }
  }
  
  if (/^\d{4}$/.test(input)) {
    const year = Number(input)
    return {
      start: new Date(year, 0, 1).getTime(),
      end: new Date(year + 1, 0, 1).getTime()
    }
  }

  const months = [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ]
  const monthIndex = months.indexOf(input)
  if (monthIndex !== -1) {
    const year = new Date().getFullYear()
    return {
      start: new Date(year, monthIndex, 1).getTime(),
      end: new Date(year, monthIndex +1, 1).getTime()
    }
  }

  
  const rangeMatch = input.match(/(.+)\s+to\s+(.+)/)
  if (rangeMatch) {
    const start = new Date(rangeMatch[1]).getTime()
    const end = new Date(rangeMatch[2]).getTime()
    if (!isNaN(start) && !isNaN(end)) return { start, end }
  }

  return {}
}


export default {
  data: new SlashCommandBuilder()
    .setName('rq')
    .setDescription('Get a random quote from all your messages')
    .addUserOption(option =>
      option
        .setName('target')
        .setDescription('Get a quote from this user')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('anyone')
        .setDescription('Get a random quote from anyone?')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('timeframe')
        .setDescription('eg: 24h, 7d, january, 2026, yyyy-mm-dd to yyyy-mm-dd')
        .setRequired(false)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const target = interaction.options.getUser('target')
    const anyone = interaction.options.getBoolean('anyone') ?? false
    const timeframe = interaction.options.getString('timeframe') ?? undefined

    const timestamps = parseTimeframe(timeframe)

    let quote
    if (anyone) {
      quote = getRandQuote(undefined, timestamps)
    } else {
      const userId = (target ?? interaction.user).id
      quote = getRandQuote(userId, timestamps)
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