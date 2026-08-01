import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { db } from '~/db/discord'
import type { DB } from '~/types/data'


export default {
  data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('how gay are you?')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('how gay is this person?')
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt
        .setName('percent')
        .setDescription('gay percent')
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(100)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user')
    const percent = interaction.options.getInteger('percent') ?? 100
    const sender = interaction.user
    const user = target ?? sender

    const result = db.prepare('SELECT count FROM gay WHERE userId = ? AND percent = ?').get(user.id, percent) as DB.Gay|undefined
    if (!result) return await interaction.reply({ content: 'No count to show.', flags: MessageFlags.Ephemeral })
    
    await interaction.reply({ content: `${!target ? user : user.username} is **${percent}% gay** x${result.count}` })
  }
}