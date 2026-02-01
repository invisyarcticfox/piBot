import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command } from '@types'
import { readGayFile, writeGayFile } from '@utils'


const specifics:Record<number,string> = {
  100: '<a:SUBLIME:1467302402016415940> <:NOWAY:1467316176945414344> !!!',
  99:  '<:Sadge:1467304431090401422> so close...',
  69:  '<:EZ:1467303756021371058> Nice.',
  67:  '<:67:1467334369030181028> You\'re such a fat fucking chud.',
  66:  'Execute Order 66... <a:66:1467564592438968340>',
  64:  '<:steve:1467365242110607426> that\'s a whole stack of gay!',
  50:  '<:BiPride:1467302829994803241>',
  42:  '<a:Life:1467303155313147924>',
  40:  'thank god it wasn\'t 21% <a:thankgoditwasnt:1467303481781129310>',
  21:  '<a:Awkward:1467300404038467695>',
  1:   '<a:Saved:1467302970323501076> barely made it...',
  0:   '<:Weirdge:1467316601949786144> ban this guy...'
}

const gayCommand:Command = {
  scope: 'GLOBAL',
  data: new SlashCommandBuilder()
    .setName('gay')
    .setDescription('how gay are you?')
    .addUserOption(option =>
      option
        .setName('ray')
        .setDescription('how gay is this person?')
        .setRequired(false)
    ),


  async execute(interaction:ChatInputCommandInteraction) {
    const percent = Math.floor(Math.random() * 101)
    const target = interaction.options.getUser('ray')
    const sender = interaction.user

    const extra = specifics[percent] ?? ''
    let message:string

    if (target) { message = `${sender} casts a ray! ${target} is **${percent}% gay!** ${extra}`
    } else { message = `${sender} is **${percent}% gay!** ${extra}` }

    if (percent === 100) {
      const stats = await readGayFile()
      const trackUser = target?.id ?? sender.id
      stats[trackUser] = (stats[trackUser] ?? 0) + 1
      await writeGayFile(stats)
      console.log(`saved 100% gay entry for ${target?.username ?? sender.username}`)
    }

    await interaction.reply({ content:message })
  }
}

export default gayCommand