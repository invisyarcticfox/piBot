import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { readSeenFile } from '../../utils'
import { Command } from '../types'


export const topCommand:Command = {
  scope: 'GLOBAL',
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('Lists the top 5 most frequent entries by type, operator, or country')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('the category to count by')
        .setRequired(true)
        .addChoices(
          { name:'types', value:'type' },
          { name:'operators', value:'operator' },
          { name:'countries', value:'country' },
          { name:'photographers', value:'photographer' },
        )
    )
    .addIntegerOption(option =>
      option
        .setName('count')
        .setDescription('how many entries to show')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)
    ),
  
  async execute(interaction:ChatInputCommandInteraction) {
    const category = interaction.options.getString('category', true) as 'type'|'operator'|'country'|'photographer'
    const count = interaction.options.getInteger('count') ?? 5
    const data = await readSeenFile()
    const counts: Record<string, { total:number, unique?:Set<string> }> = {}

    Object.values(data).forEach((entry:any) => {
      const key = entry[category] || 'N/A'
      if (!counts[key]) counts[key] = category === 'photographer' ? { total: 0 } : { total: 0, unique: new Set() }
      if (category === 'photographer') { if (key !== 'N/A') counts[key].total += 1
      } else {
        counts[key].total += entry.seenCount
        counts[key].unique!.add(entry.reg)
      }
    })
    
    const entries = Object.entries(counts)
    const naEntry = entries.find(([key]) => key === 'N/A')

    const ranked = entries
      .filter(([key]) => category === 'photographer' ? key !== 'N/A' : key !== 'N/A')
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, count)

    const finalList = category === 'photographer' ? ranked : naEntry ? [...ranked, naEntry] : ranked

    const output = finalList
      .map(([key, info]) =>
        category === 'photographer' ? `${key}: ${info.total}` : `${key}: ${info.total} (${info.unique!.size} unique)`
      )
      .join('\n')

    await interaction.reply({ content: `**Top ${count} by ${category}:**\n${output}` })
  }
}