import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction, ActivityType } from 'discord.js'
import { exec } from 'child_process'
import { Command } from '@types'


const restartCommand:Command = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart InvisyArcticBot'),
  
  async execute(interaction:ChatInputCommandInteraction) {
    console.log('Restarting..')

    interaction.client.user.setPresence({
      activities: [{ type: ActivityType.Custom, name: 'Restarting... '}],
      status: 'dnd'
    }) 
    await interaction.reply({ content: 'Restarting bot...', flags: MessageFlags.Ephemeral })
    
    exec('npm run restart', (error:any, stdout:any, stderr:any) => {
      if (error) return console.error(error)
      if (stderr) return console.error(stderr)
      console.log(stdout)
    })
  }
}

export default restartCommand