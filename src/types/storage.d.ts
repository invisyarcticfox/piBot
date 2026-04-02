export type MessageRow = {
  messageId: string
  guildId: string
  channelId: string
  userId: string
  content: string|null
  timestamp: number
  repliedUser: string|null
}

export type gayStats = Record<number, Record<string, number>>

export type Whitelist = {
  guilds: {
    id: string
    categories?: string[]
    channels?: string[]
  }[]
}

export type Jetspotter = {
  hex: string
  reg: string
  callsign: string
  type: string
  operator: string
  country: string
  category: string
  seenCount: string
  lastSee: string
  photographed: string
  photographer: string
}