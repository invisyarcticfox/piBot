import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '~/types'

const dayoffCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('dayoff')
    .setDescription('give yourself a day off! (for 6 hours)'),

  async execute(interaction:ChatInputCommandInteraction) {
    const member = await interaction.guild!.members.fetch(interaction.user.id)
    const hours = 60 * 60 * 1000

    if (member && !member.moderatable) {
      console.log(`Cannot timeout ${member.user.username} due to role hierarchy.`)
      return
    }

    console.log(`${member.user.username} took a day off.`)
    await interaction.reply({ content: `${member.user} took a day off, enjoy! :3` })
    await member.timeout(6 * hours, 'took a day off.')
  }
}

export default dayoffCommand