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


export type Whitelist = {
  guilds: {
    id: string
    categories?: string[]
    channels?: string[]
  }[]
}