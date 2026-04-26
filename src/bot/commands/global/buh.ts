import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'

const emotes:Record<string, string> = {
  'auh': '1495990763778084884',
  'buh': '1495980769963937822',
  'cuh': '1495982550827532379',
  'duh': '1495980773990203442',
  'euh': '1495980775269732472',
  'fuh': '1495985044987318343',
  'guh': '1495980776540340285',
  'HUH': '1495980777949892669',
  'iuh': '1495980779287740416',
  'juh': '1495982552266313920',
  'kuh': '1495982553847300156',
  'luh': '1495980786485039175',
  'muh': '1495980788037058590',
  'nuh': '1495982555663700029',
  'ouh': '1495980791077798018',
  'puh': '1495980792436887602',
  'quh': '1495982557966241893',
  'ruh': '1495982559413145600',
  'suh': '1495980798602645567',
  'tuh': '1495982560822562836',
  'uuh': '1495980803006533662',
  'vuh': '1495985185001443388',
  'wuh': '1495982562017804331',
  'xuh': '1495982563662106684',
  'YUH': '1495980810766127344',
  'zuh': '1495980812200448102',
}


export default {
  data: new SlashCommandBuilder()
    .setName('buh')
    .setDescription('buh'),

  async execute(interaction:ChatInputCommandInteraction) {
    await interaction.reply({ content: Object.entries(emotes).map(([name, id]) => `<a:${name}:${id}>`).join(' ') })
  }
}