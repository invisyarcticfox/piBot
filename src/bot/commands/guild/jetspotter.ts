import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { Jetspotter } from '~/types'
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
            .setMaxValue(20)
            .setRequired(false)
        )
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    try {
      const subcommand = interaction.options.getSubcommand()

      if (subcommand === 'photographed') {
        const rows = jsDb.prepare('SELECT operator, type, reg, category FROM jetspotter WHERE photographed = 1 ORDER BY operator COLLATE NOCASE, type COLLATE NOCASE').all() as Jetspotter[]
        const getInitials = (op:string) => op.split(' ').filter(Boolean).map(word => word[0].toUpperCase()).join('') || ''

        const output = rows.map(r => `${getInitials(r.operator)} ${r.type} (*${r.reg}*) ${r.category === 'whitelisted' ? '*' : ''}`).join('\n')
        await interaction.reply({ content: `**Photographed Entries (${rows.length}):**\n${output}` })
        return
      }

      if (subcommand === 'top') {
        const category = interaction.options.getString('category') as 'type'|'operator'|'country'|'photographer'
        const count = interaction.options.getInteger('count') ?? 5

        type jsRowTotal = { key:string, total:number, grand_total?:number }
        let rows:jsRowTotal[]

        if (category === 'type') rows = jsDb.prepare(`SELECT type as key, COUNT(*) as total, SUM(seenCount) as grand_total FROM jetspotter GROUP BY type`).all() as jsRowTotal[]
        else rows = jsDb.prepare(`SELECT ${category} as key, COUNT(*) as total FROM jetspotter GROUP BY ${category}`).all() as jsRowTotal[]

        const filtered = rows.filter(r => r.key !== null && r.key !== '').sort((a, b) => b.total - a.total).slice(0, count)
        const output = filtered.map(r => {
          if (category === 'type') return `${r.key}: ${r.total} (${r.grand_total} total)`
          return `${r.key}: ${r.total}`
        }).join('\n')

        await interaction.reply({ content: `**Top ${count} by ${category}:**\n${output}` })
        return
      }

    } catch (error) {
      console.error(error)
      if (!interaction.replied) await interaction.reply({ content: 'Error executing command', flags: MessageFlags.Ephemeral })
    }
  }
}