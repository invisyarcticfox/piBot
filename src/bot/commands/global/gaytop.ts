import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { fetchMember } from '~/bot/utils'
import { db } from '~/db/discord'
import type { DB } from '~/types/data'


export default {
  data: new SlashCommandBuilder()
    .setName('gaytop')
    .setDescription('who are the top gays?')
    .addIntegerOption(opt =>
      opt
        .setName('percent')
        .setDescription('gay percent')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const percent = interaction.options.getInteger('percent') ?? 100

    const results = db.prepare('SELECT userId, count FROM gay WHERE percent = ? ORDER BY count DESC LIMIT 5').all(percent) as DB.Gay[]
    if (!results.length) return await interaction.reply({ content: 'No top users to show.', flags: MessageFlags.Ephemeral })

    const leader = await Promise.all(
      results.map(async (r, i) => {
        const member = await fetchMember(r.userId, interaction.guild!)
        return `${i + 1}. ${member?.user.username} is **${percent}% gay** x${r.count}`
      })
    )
    
    await interaction.reply({ content: leader.join('\n') })
  }
}