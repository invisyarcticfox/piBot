import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { msgDb } from '~/db'


export default {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('gamble!!!')
    .addSubcommand(sub =>
      sub
        .setName('bet')
        .setDescription('gamble your points')
        .addStringOption(option =>
          option
            .setName('amount')
            .setDescription('number or percent (e.g. 50 or 25%)')
            .setRequired(true)
            .setMinLength(1)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('top')
        .setDescription('roulette leaderboard')
    )
    .addSubcommand(sub =>
      sub
        .setName('points')
        .setDescription('check your points')
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand()
    const userId = interaction.user.id

    if (sub === 'top') {
      const rows = msgDb.prepare(`SELECT userId, points FROM roulette ORDER BY points DESC LIMIT 10 `).all() as { userId:string, points:number }[]
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

    if (sub === 'points') {
      const user = msgDb.prepare(`SELECT userId, points FROM roulette WHERE userId = ? `).get(userId) as { points:number }
      return interaction.reply({ content: `You have ${user.points} points.`, flags: MessageFlags.Ephemeral })
    }

    if (sub === 'bet') {
      const input = interaction.options.getString('amount', true).trim()
      const user = msgDb.prepare(`SELECT userId, points FROM roulette WHERE userId = ? `).get(userId) as { points:number }

      const totalPoints = user.points
      if (totalPoints <= 0) return interaction.reply({ content: 'You have no points to gamble, sorry :(', flags: MessageFlags.Ephemeral })

      let bet:number

      if (input.endsWith('%')) {
        const percent = Number(input.slice(0, -1))
        if (isNaN(percent) || percent < 1 || percent > 100) return interaction.reply({ content: 'Percent must be between 1% and 100%.', flags: MessageFlags.Ephemeral })
        bet = Math.max(1, Math.floor((percent / 100) * totalPoints))
      } else {
        const value = Number(input)
        if (isNaN(value) || value < 1) return interaction.reply({ content: 'Enter a valid number or percentage (e.g. 50 or 25%).', flags: MessageFlags.Ephemeral })
        if (value > totalPoints) return interaction.reply({ content: `You only have ${totalPoints} points.`, flags: MessageFlags.Ephemeral })
        bet = Math.floor(value)
      }

      const win = Math.random() < 0.5
      const newPoints = Math.max(0, win ? totalPoints + bet : totalPoints - bet)

      msgDb.prepare(`UPDATE roulette SET points = ? WHERE userId = ? `).run(newPoints, userId)
      const resText = win ? 'won' : 'lost'
      return interaction.reply({ content: `You ${resText} ${bet} points, you now have ${newPoints} points.` })
    }
  }
}