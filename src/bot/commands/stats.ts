import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { readSeenFile } from '../../utils'
import { Command } from '../types'


export const statsCommand:Command = {
  scope: 'GLOBAL',
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Lists the top 5 most frequent plane types'),
  
  async execute(interaction:ChatInputCommandInteraction) {
    const data = await readSeenFile()
    const counts:Record<string, { total:number, unique:Set<string> }> = {}

    Object.values(data).forEach((entry:any) => {
      const type = entry.type
      if (!counts[type]) counts[type] = { total: 0, unique: new Set() }
      
      counts[type].total += entry.seenCount
      counts[type].unique.add(entry.reg)
    })

    const top = Object.entries(counts)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0,5)
      .map(([type, info]) => `${type}: ${info.total} (${info.unique.size} unique)`)
      .join('\n')
    
    await interaction.reply({ content: `**Top 5 plane types:**\n${top}` })
  }
}