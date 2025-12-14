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