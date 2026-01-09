import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js'


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