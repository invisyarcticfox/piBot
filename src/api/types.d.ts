import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js'


export interface Command {
  data: SlashCommandBuilder|SlashCommandOptionsOnlyBuilder|SlashCommandSubcommandsOnlyBuilder
  scope: 'GUILD' | 'GLOBAL'
  execute(interation:ChatInputCommandInteraction):Promise<void>
}

export type jsRes = {
  category: string
  embed: {
    color: string
    fields: { name:string, value:string, inline?:boolean }[]
    image?: { url: string } | undefined
    footer: { text: string }
  },
  buttons: { adsbexchange: string, planespotters?: string|undefined }
}

export type seenEntry = { reg:string, type:string, seenCount:number }
export type seenData = Record<string, seenEntry>
export type seenFileData = Record<string, { total:number, unique:Set<string> }>