import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { msgDb } from '~/db'


export default {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('gamble!!!')
    .addSubcommand(sub =>
      sub
        .setName('play')
        .setDescription('gamble your points')
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('percentage of your points (1-100)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('top')
        .setDescription('roulette leaderboard')
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand()
    const userId = interaction.user.id

    if (sub === 'top') {
      const rows = msgDb.prepare(`SELECT userId, msgCount, points FROM roulette ORDER BY points DESC LIMIT 10 `).all() as { userId:string, msgCount:number, points:number }[]
      if (!rows.length) return interaction.reply({ content: 'No data yet.', flags: MessageFlags.Ephemeral })

      const lines = await Promise.all(
        rows.map(async (row, i) => {
          let username = 'Unknown'
          try {
            const user = await interaction.client.users.fetch(row.userId)
            username = user.username
          } catch {}
          return `${i + 1}. ${username} - ${row.points} points`
        })
      )

      return interaction.reply({ content: `**Roulette Leaderboard**\n${lines.join('\n')}` })
    }

    if (sub === 'play') {
      const percent = interaction.options.getInteger('amount', true)

      const user = msgDb.prepare(`SELECT userId, msgCount, points FROM roulette WHERE userId = ? `).get(userId) as { points:number } | undefined
      if (!user) return interaction.reply({ content: 'No data found for you yet, sorry :(', flags: MessageFlags.Ephemeral })

      const totalPoints = user.points
      if (totalPoints <= 0) return interaction.reply({content: 'You have no points to gamble, sorry :(',flags: MessageFlags.Ephemeral})

      const bet = Math.max(1, Math.floor((percent / 100) * totalPoints))
      const win = Math.random() < 0.5
      const newPoints = Math.max(0, win ? totalPoints + bet : totalPoints - bet)

      msgDb.prepare(`UPDATE roulette SET points = ? WHERE userId = ? `).run(newPoints, userId)
      const resText = win ? 'won' : 'lost'
      return interaction.reply({ content: `You ${resText} ${bet} points, you now have ${newPoints} points.` })
    }
  }
}