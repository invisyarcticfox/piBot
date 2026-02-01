import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '@types'
import { readGayFile } from '@utils'


const howGayCommand:Command = {
  scope: 'GLOBAL',
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
    ),


  async execute(interaction:ChatInputCommandInteraction) {
    const stats = await readGayFile()
    const sender = interaction.user
    const userOpt = interaction.options.getUser('user')
    const topOpt = interaction.options.getBoolean('top')

    if (topOpt) {
      const sorted = Object.entries(stats).sort(([,a], [,b]) => b - a).slice(0, 5)
      
      const lines = await Promise.all(
        sorted.map(async ([id, count], i) => {
          const user = await interaction.client.users.fetch(id).catch(() => null)
          const name = user?.username ?? 'Unknown User'
          return `${i + 1}. ${name} is gay x${count}!`
        })
      )
    
      const message = `**Top ${sorted.length} gay users**\n` + lines.join('\n')
      await interaction.reply({ content: message })
    } else { 
      const target = userOpt ?? sender
      const count = stats[target.id] ?? 0
      await interaction.reply({ content: `${target} is gay x${count}!` })
    }
  }
}

export default howGayCommand