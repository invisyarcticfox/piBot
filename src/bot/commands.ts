import { SlashCommandBuilder, MessageFlags, type CommandInteraction } from 'discord.js'
import { exec } from 'child_process'
import { userId } from '.'


export const commands = [
  new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart PiBot service on raspi'),
  
  new SlashCommandBuilder()
    .setName('hardrestart')
    .setDescription('Rebuild PiBot and restart service on raspi')
]

export async function handleCommands(interaction:CommandInteraction) {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'restart') {
    const allowedUsers = [userId]
    if (!allowedUsers.includes(interaction.user.id)) {
      await interaction.reply({ content: 'fail', flags: MessageFlags.Ephemeral })
      return
    }

    await interaction.reply({ content: 'Restarting bot...', flags: MessageFlags.Ephemeral })

    exec('sudo systemctl restart discordbot', (error:any, stdout:any, stderr:any) => {
      if (error) { console.error(error); return }
      if (stderr) { console.error(`stderr: ${stderr}`); return }
      console.log(`stdout: ${stdout}`)
    })
  }

  if (interaction.commandName === 'hardrestart') {
    const allowedUsers = [userId]
    if (!allowedUsers.includes(interaction.user.id)) {
      await interaction.reply({ content: 'fail', flags: MessageFlags.Ephemeral })
      return
    }

    await interaction.reply({ content: 'Restarting bot...', flags: MessageFlags.Ephemeral })

    exec('npm run build', (error:any, stdout:any, stderr:any) => {
      if (error) { console.error(error); return }
      if (stderr) { console.error(`stderr: ${stderr}`); return }
      console.log(`stdout: ${stdout}`)

      exec('sudo systemctl restart discordbot', (error:any, stdout:any, stderr:any) => {
        if (error) { console.error(error); return }
        if (stderr) { console.error(`stderr: ${stderr}`); return }
        console.log(`stdout: ${stdout}`)
      })
    })
  }
}