import { SlashCommandBuilder, MessageFlags, type ChatInputCommandInteraction } from 'discord.js'
import { exec } from 'child_process'
import { userId } from '.'
import { readSeenFile } from '../utils'


export const guildCommands = [
  new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restart PiBot')
    .addBooleanOption(opt =>
      opt.setName('hard')
      .setDescription('Hard restart PiBot by rebuilding first')
      .setRequired(false)
    )
]
export const serverCommands = [
  new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Lists the top 5 most frequent plane types')
]

export async function handleCommands(interaction:ChatInputCommandInteraction) {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'restart') {
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

  if (interaction.commandName === 'stats') {
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