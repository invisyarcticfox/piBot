import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js'

export type Command = {
  data:SlashCommandBuilder
  execute(interaction:ChatInputCommandInteraction):Promise<void>
  autocomplete?(interaction:AutocompleteInteraction):Promise<void>
}