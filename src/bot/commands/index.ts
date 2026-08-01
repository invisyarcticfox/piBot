import path from 'node:path'
import { loadCommands } from './loader'
import type { Command } from '~/types/djs'

export async function getGuildCommands():Promise<Command[]> {
  return loadCommands(path.join(__dirname, 'guild'))
}
export async function getGlobalCommands():Promise<Command[]> {
  return loadCommands(path.join(__dirname, 'global'))
}

export async function getCommands():Promise<Command[]> {
  const [guild, global] = await Promise.all([ getGuildCommands(), getGlobalCommands(), ])

  return [ ...guild, ...global, ]
}