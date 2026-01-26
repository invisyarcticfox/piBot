import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { EmoteName } from './api/jetspotter/routes/msg'


export interface Command {
  data: SlashCommandBuilder|SlashCommandOptionsOnlyBuilder|SlashCommandSubcommandsOnlyBuilder
  scope: 'GUILD'|'GLOBAL'
  execute(interation:ChatInputCommandInteraction):Promise<void>
}

export type SeenFile = {
  [hex:string]: {
    reg: string
    callsign: string
    type: string
    operator: string
    country: string
    category?: string
    seenCount: number
    lastSeen: string
    photographed?: boolean
    photographer?: boolean
  }
}

export type jsRes = {
  category: string
  embed: {
    color: string
    fields: { name:string, value:string, inline?:boolean }[]
    image?: { url:string } | undefined
    footer: { text:string }
  },
  buttons: { name:EmoteName, link:string|null, row:number }[]
}