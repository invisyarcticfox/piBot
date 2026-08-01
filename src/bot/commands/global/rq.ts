import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js'
import { fetchMember } from '~/bot/utils'
import { db } from '~/db/discord'
import type { DB } from '~/types/data'


export default {
  data: new SlashCommandBuilder()
    .setName('rq')
    .setDescription('get a random quote')
    .addUserOption(opt =>
      opt
        .setName('someone')
        .setDescription('get a random quote from someone else')
        .setRequired(false)
    ),

  async execute(interaction:ChatInputCommandInteraction) {
    const user = interaction.options.getUser('someone') ?? interaction.user

    const rq = db.prepare('SELECT * FROM messages WHERE userId = ? ORDER BY RANDOM() LIMIT 1').get(user.id) as DB.RQ
    if (!rq) return await interaction.reply({ content: 'No quotes for this user.', flags: MessageFlags.Ephemeral })

    let content = rq.content
    const ids = [...new Set([...content.matchAll(/<@!?(\d+)>/g)].map(m => m[1]))]
    for (const id of ids) {
      const member = await fetchMember(id, interaction.guild!)
      content = content.replaceAll(new RegExp(`<@!?${id}>`, 'g'), `*@${member?.user.username}*`)
    }
    
    let repliedName:string|undefined
    if (rq.repliedUser) {
      const member = await fetchMember(rq.repliedUser, interaction.guild!)
      repliedName = member?.user.username
    }

    await interaction.reply({
      content:
        `<t:${Math.floor(rq.timestamp / 1000)}:R> @${user.username}: ` +
        `${rq.repliedUser ? `*@${repliedName}* ${content}` : content}\n`
    })
  }
}