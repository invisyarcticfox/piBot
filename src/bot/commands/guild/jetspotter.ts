import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { jsDb } from '~/db'

export default {
  data: new SlashCommandBuilder()
    .setName('jetspotter')
    .setDescription('Jetspotter related commands')
    .addSubcommand(sub =>
      sub
        .setName('photographed')
        .setDescription('Lists all photographed planes')
    )
    .addSubcommand(sub =>
      sub
        .setName('top')
        .setDescription('Lists the top most frequent entries by type, operator, country, or photographer')
        .addStringOption(option =>
          option
            .setName('category')
            .setDescription('The category to count by')
            .setRequired(true)
            .addChoices(
              { name: 'types', value: 'type' },
              { name: 'operators', value: 'operator' },
              { name: 'countries', value: 'country' },
              { name: 'photographers', value: 'photographer' }
            )
        )
        .addIntegerOption(option =>
          option
            .setName('count')
            .setDescription('How many entries to show')
            .setMinValue(1)
            .setMaxValue(15)
            .setRequired(false)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const subcommand = interaction.options.getSubcommand()

      if (subcommand === 'photographed') {
        // Query all photographed planes
        const rows = jsDb.prepare('SELECT type, reg FROM jetspotter WHERE photographed = 1').all()
        const output = rows.map((r: any) => `${r.type} (*${r.reg}*)`).join('\n') || 'No entries found.'
        await interaction.reply({ content: `**Photographed Entries (${rows.length}):**\n${output}` })
        return
      }

      if (subcommand === 'top') {
        const category = interaction.options.getString('category', true) as 'type'|'operator'|'country'|'photographer'
        const count = interaction.options.getInteger('count') ?? 5

        const rows = jsDb
          .prepare(`SELECT ${category} as key, COUNT(*) as total FROM jetspotter GROUP BY ${category}`)
          .all() as { key: string; total: number }[]

        const filtered = rows.filter(r => r.key !== null && r.key !== '').sort((a, b) => b.total - a.total).slice(0, count)
        const output = filtered.map(r => `${r.key}: ${r.total}`).join('\n') || 'No entries found.'

        await interaction.reply({ content: `**Top ${count} by ${category}:**\n${output}` })
        return
      }

      // Fallback if subcommand not recognized
      await interaction.reply({ content: 'Unknown subcommand', flags: MessageFlags.Ephemeral })
    } catch (error) {
      console.error(error)
      if (!interaction.replied) await interaction.reply({ content: 'Error executing command', flags: MessageFlags.Ephemeral })
    }
  }
}