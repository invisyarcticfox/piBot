import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js'
import { exec } from 'child_process'
import { userId } from '../config'
import { Command } from '../types'


export const restartCommand:Command = {
  scope: 'GUILD',
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart PiBot')
    .addBooleanOption(opt =>
      opt.setName('hard')
      .setDescription('Hard restart PiBot by rebuilding first')
      .setRequired(false)
    ),
  
  async execute(interaction:ChatInputCommandInteraction) {
    const allowedUsers = [userId]
    if (!allowedUsers.includes(interaction.user.id)) {
      await interaction.reply({ content: 'You are not a whitelisted user.', flags: MessageFlags.Ephemeral })
      return
    }

    const hard = interaction.options.getBoolean('hard') ?? false

    if (!hard) { 
      await interaction.reply({ content: 'Restarting bot...', flags: MessageFlags.Ephemeral })
      exec('sudo systemctl restart discordbot', (error:any, stdout:any, stderr:any) => {
        if (error) return console.error(error)
        if (stderr) return console.error(stderr)
        console.log(stdout)
      })
    } else {
      await interaction.reply({ content: 'Hard restarting bot...', flags: MessageFlags.Ephemeral })
      exec('npm run build', (error:any, stdout:any, stderr:any) => {
        if (error) return console.error(error)
        if (stderr) return console.error(stderr)
        console.log(stdout)
          exec('sudo systemctl restart discordbot', (error2:any, stdout2:any, stderr2:any) => {
          if (error2) return console.error(error2)
          if (stderr2) return console.error(stderr2)
          console.log(stdout2)
        })
      })
    }
  }
}