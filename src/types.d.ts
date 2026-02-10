import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'
import { EmoteName } from './api/jetspotter/routes/msg'


export type Command = {
  data: SlashCommandBuilder|SlashCommandOptionsOnlyBuilder|SlashCommandSubcommandsOnlyBuilder
  execute: (interation:ChatInputCommandInteraction) => Promise<void>
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

export type gayStats = {
  gay: Record<string,number>
  bi: Record<string,number>
  straight: Record<string,number>
}