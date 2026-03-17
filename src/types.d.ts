import { Client, Collection, SlashCommandBuilder } from 'discord.js'
import { ChatInputCommandInteraction } from 'discord.js'


export interface BotCommand {
  data: SlashCommandBuilder
  execute: (interaction:ChatInputCommandInteraction) => Promise<void>
}

export interface BotClient extends Client { commands:Collection<string, BotCommand> }


export interface MessageRow {
  messageId: string
  guildId: string
  channelId: string
  userId: string
  content: string|null
  timestamp: number
  repliedUser: string|null
}

export type gayStats = {
  gay: Record<string,number>
  bi: Record<string,number>
  straight: Record<string,number>
}

export type jsRes = {
  category: string
  embed: {
    color: number
    fields: { name:string, value:string, inline?:boolean }[]
    image?: { url:string } | undefined
    footer: { text:string }
  },
  buttons: { name:EmoteName, link:string|null, row:number }[]
}
