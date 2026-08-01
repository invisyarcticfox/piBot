import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { db } from '~/db/discord'
import type { DB } from '~/types/data'


export default {
  data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('gamble your points!')
    .addStringOption(opt =>
      opt
        .setName('bet')
        .setDescription('number or percent (50, 25%, 300, 90%)')
        .setRequired(true)
        .setMinLength(1)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const betInt = interaction.options.getString('bet', true).trim()
    const userId = interaction.user.id

    const user = db.prepare(`
      INSERT INTO roulette (userId) VALUES (?)
      ON CONFLICT(userId) DO UPDATE SET userId = excluded.userId
      RETURNING *
    `).get(userId) as DB.Roulette


    const isPercentage = betInt.endsWith('%')
    const value = Number(betInt.replace('%', ''))
    if (!Number.isFinite(value) || value <= 0) return await interaction.reply({ content: 'Invalid bet amount.', flags: MessageFlags.Ephemeral })

    const bet = isPercentage ? Math.floor(user.points * (value / 100)) : value
    if (bet <= 0) return await interaction.reply({ content: 'Your bet is too small.', flags: MessageFlags.Ephemeral })
    if (bet > user.points) return await interaction.reply({ content: `You cannot bet **${bet}** points.\n` + `You only have **${user.points}** points.`, flags: MessageFlags.Ephemeral })

    const won = Math.random() < 0.5
    const change = won ? bet : -bet
    const newPoints = user.points + change

    db.prepare(`UPDATE roulette SET points = ? WHERE userId = ?`).run(newPoints, userId)

    await interaction.reply({
      content:
        `You ${won ? 'won' : 'lost'} ${bet} points${won ? '!' : ' :('}\n` +
        `You now have **${newPoints}** points.`
    })
  }
}