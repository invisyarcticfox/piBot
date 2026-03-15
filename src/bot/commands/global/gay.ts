import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import type { Command, gayStats } from '~/types'
import { readGayFile, writeGayFile } from '~/utils'
import { botId } from '~/bot/config'


const specifics:Record<number,string> = {
  100: '<a:SUBLIME:1467302402016415940> <:NOWAY:1467316176945414344> <a:OOOO:1467883971521155143> !!!',
  99:  '<:Sadge:1467304431090401422> so close...',
  69:  '<:EZ:1467303756021371058> Nice.',
  67:  '<a:67:1467883796886982748> You\'re such a fat fucking chud.',
  64:  '<:steve:1467365242110607426> that\'s a whole stack of gay!',
  50:  '<:BiPride:1467302829994803241>',
  42:  '<a:Life:1467303155313147924>',
  40:  'thank god it wasn\'t 21% <a:thankgoditwasnt:1467303481781129310>',
  21:  '<a:Awkward:1467300404038467695>',
  1:   '<a:Saved:1467302970323501076> barely made it...',
  0:   '<:Weirdge:1467316601949786144> ban this guy...'
}

const gayCommand:Command = {
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

    if (target && target.id === sender.id) {
      await interaction.reply({ content: 'You can\'t ray yourself! smh', flags: MessageFlags.Ephemeral })
      return
    }

    if (target && target.id === botId) {
      await interaction.reply({ content: 'Ray someone else. smh.', flags: MessageFlags.Ephemeral })
      return
    }

    if (target) message = `${sender} casts a ray! <a:GAY:1467831355554660494> ${target} is **${percent}% gay!** ${extra}`
    else message = `${sender} is **${percent}% gay!** ${extra}`

    await interaction.reply({ content: message })

    if (percent === 100 || percent === 50 || percent === 0) {
      const stats = await readGayFile()
      const user = target?.id ?? sender.id

      let category:keyof gayStats
      if (percent === 100) category = 'gay'
      else if (percent === 50) category = 'bi'
      else category = 'straight'

      stats[category][user] = (stats[category][user] ?? 0) + 1
      await writeGayFile(stats)
    }

    if (percent === 0 || percent === 67) {
      const user = target ?? sender
      const member = await interaction.guild!.members.fetch(user.id).catch(() => null)

      if (member) {
        console.log(`Timed out @${member.user.username} for 15 seconds.`)
        await member.timeout(15_000, `Rolled ${percent}% in /gay command`)
      }
    }
  }
}

export default gayCommand