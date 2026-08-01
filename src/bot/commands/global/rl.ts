import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { fetchMember } from '~/bot/utils'
import { db } from '~/db/discord'
import type { DB } from '~/types/data'


export default {
  data: new SlashCommandBuilder()
    .setName('rl')
    .setDescription('roulette stats')
    .addSubcommand(sub =>
      sub
        .setName('points')
        .setDescription('view your points')
    )
    .addSubcommand(sub =>
      sub
        .setName('top')
        .setDescription('view top gamblers')
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand() as 'points'|'top'

    if (sub === 'points') {
      const result = db.prepare('SELECT * FROM roulette WHERE userId = ?').get(interaction.user.id) as DB.Roulette|undefined
      if (!result)
        return await interaction.reply({
          content:
            'You have **100 points**.\n' +
            'Your points will increase by 1 point every 5 messages after you run </roulette:1527254207172972655> for the first time.',
          flags: MessageFlags.Ephemeral
        })

      return await interaction.reply({ content: `You have **${result.points} points**.`, flags: MessageFlags.Ephemeral })
    }

    if (sub === 'top') {
      const results = db.prepare('SELECT * FROM roulette ORDER BY points DESC LIMIT 10').all() as DB.Roulette[]
      if (!results.length) return await interaction.reply({ content: 'No top users to show.', flags: MessageFlags.Ephemeral })

      const leader = await Promise.all(
        results.map(async (r, i) => {
          const member = await fetchMember(r.userId, interaction.guild!)
          return `${i + 1}. ${member?.user.username} - **${r.points}** points`
        })
      )

      return await interaction.reply({ content: leader.join('\n') })
    }
  }
}