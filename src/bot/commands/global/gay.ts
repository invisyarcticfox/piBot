import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { fetchMember } from '~/bot/utils'
import { db } from '~/db/discord'

const specifics:Record<number,string> = {
  100: '<a:SUBLIME:1467302402016415940> <:NOWAY:1484274336084005107> <a:OOOO:1467883971521155143> !!!',
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


export default {
  data: new SlashCommandBuilder()
    .setName('gay')
    .setDescription('how gay are you?')
    .addUserOption(opt =>
      opt
        .setName('ray')
        .setDescription('how gay is this person?')
        .setRequired(false)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const percent = Math.floor(Math.random() * 101)
    const target = interaction.options.getUser('ray')
    const sender = interaction.user

    const userId = target?.id ?? sender.id
    const extra = specifics[percent] ?? ''

    if (target && target.id === sender.id) return await interaction.reply({ content: 'You can\'t ray yourself smh', flags: MessageFlags.Ephemeral })
    if (target && target.bot) return await interaction.reply({ content: 'Ray someone else smh', flags: MessageFlags.Ephemeral })
    
    const message = target
      ? `${sender} casts a ray! ${target} is **${percent}% gay**! ${extra}`
      : `${sender} is **${percent}% gay**! ${extra}`

    db.prepare(`
      INSERT INTO gay (userId, percent)
      VALUES (?, ?)
      ON CONFLICT (userId, percent)
      DO UPDATE SET count = count + 1
    `).run(userId, percent)
    await interaction.reply(message)

    if (percent === 0 || percent === 67) {
      const member = await fetchMember(userId, interaction.guild!)
      if (!member?.moderatable) return console.warn(`Cannot timeout ${member?.user.username} due to insufficient permissions.`)

      console.log(`Timed out ${member?.user.username} for 15 seconds.`)
      await member?.timeout(15_000, `Rolled ${percent}% in /gay`)
    }
  }
}