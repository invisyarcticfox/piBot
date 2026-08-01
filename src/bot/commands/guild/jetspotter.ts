import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { JsDb } from '~/db/jetspotter'
import type { DB } from '~/types/data'


export default {
  data: new SlashCommandBuilder()
    .setName('jetspotter')
    .setDescription('jetspotter')
    .addSubcommand(sub =>
      sub
        .setName('photographed')
        .setDescription('list photographed planes')
    )
    .addSubcommand(sub =>
      sub
        .setName('top')
        .setDescription('list top frequently seen planes')
        .addStringOption(opt =>
          opt
            .setName('category')
            .setDescription('the category to sort by')
            .setRequired(true)
            .addChoices(
              { name: 'types', value: 'type' },
              { name: 'operators', value: 'operator' },
              { name: 'countries', value: 'country' },
              { name: 'photographers', value: 'photographer' },
            )
        )
        .addIntegerOption(opt =>
          opt
            .setName('count')
            .setDescription('how many to list')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt
            .setName('sort')
            .setDescription('how to sort the list')
            .setRequired(false)
            .addChoices(
              { name: 'unique', value: 'unique' },
              { name: 'total', value: 'total' },
            )
        )
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const sub = interaction.options.getSubcommand() as 'photographed'|'top'

    if (sub === 'photographed') {
      const rows = JsDb.prepare('SELECT * FROM jetspotter WHERE photographed = 1 ORDER BY reg COLLATE NOCASE').all() as DB.JetSpotter[]
      function inits(op:string):string { return op.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).join('') || '' }
      const out = rows.map(r => `${inits(r.operator)} ${r.type} (*${r.reg}*) ${r.category === 'whitelisted' ? '*' : ''}`).join('\n')

      return await interaction.reply({ content: `**Photographed entries (${rows.length}):**\n${out}` })
    }

    if (sub === 'top') {
      const category = interaction.options.getString('category') as 'type'|'operator'|'country'|'photographer'
      const count = interaction.options.getInteger('count') ?? 5
      const sort = interaction.options.getString('sort') as 'unique'|'total' ?? 'unique'

      const order:Record<'unique'|'total', string> = {
        unique: 'entries DESC, totalSeen DESC',
        total: 'totalSeen DESC, entries DESC',
      }

      const rows = JsDb.prepare(`
        SELECT ${category} AS value, COUNT(*) AS entries, SUM(seenCount) as totalSeen FROM jetspotter
        WHERE ${category} IS NOT NULL AND ${category} != ''
        GROUP BY ${category} ORDER BY ${order[sort]} LIMIT ?
      `).all(count) as { value:string, entries:number, totalSeen:number }[]
      const out = rows.map(r => `${r.value}: ${r.entries} *(${r.totalSeen} total)*`).join('\n')

      return await interaction.reply({ content: `**Top ${count} by ${category}:**\n${out}` })
    }
  }
}