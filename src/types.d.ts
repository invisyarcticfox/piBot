import { Client, Collection } from 'discord.js'
import { ChatInputCommandInteraction } from 'discord.js'


export interface BotCommand {
  data: any
  execute: (interaction:ChatInputCommandInteraction) => Promise<void>
}

export interface BotClient extends Client { commands:Collection<string, BotCommand> }