import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '@types'
import { readGayFile } from '@utils'


const howGayCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('howgay')
    .setDescription('how many gay are you?')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('how many gay is this person?')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('top')
        .setDescription('Show top 5 gays!')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('bi')
        .setDescription('show bi results rather than gay')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName('count')
        .setDescription('How many users to return')
        .setRequired(false)
        .setMinValue(5).setMaxValue(20)
    ),


  async execute(interaction:ChatInputCommandInteraction) {
    const stats = await readGayFile()
    const sender = interaction.user
    const userOpt = interaction.options.getUser('user')
    const topOpt = interaction.options.getBoolean('top')
    const biOpt = interaction.options.getBoolean('bi')
    const count = interaction.options.getInteger('count')

    const category = biOpt ? 'bi' : 'gay'
    const categoryStats = stats[category]

    if (topOpt) {
      const sorted = Object.entries(categoryStats).sort(([,a], [,b]) => b - a).slice(0, count ?? 5)
      
      const lines = await Promise.all(
        sorted.map(async ([id, count], i) => {
          const name = (await interaction.client.users.fetch(id)).username
          return `${i + 1}. ${name} is **${category === 'gay' ? '100% gay' : '50% bi'}** x${count}`
        })
      )
    
      const message = `**Top ${sorted.length} ${category} users**\n` + lines.join('\n')
      await interaction.reply({ content: message })
    } else { 
      const target = userOpt ?? sender
      const count = categoryStats[target.id] ?? 0
      await interaction.reply({ content: `${target} is **${category === 'gay' ? '100% gay' : '50% bi'}** x${count}` })
    }
  }
}

export default howGayCommand