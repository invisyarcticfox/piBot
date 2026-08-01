export namespace DB {
  type Roulette = { userId:string, points:number }
  type Gay = { userId:string, percent:number, count:number }
  type RQ = {
    guildId: string
    channelId: string
    messageId: string
    userId: string,
    content: string,
    timestamp: number,
    repliedUser?: string|null
  }

  type JetSpotter = {
    hex: string
    reg: string
    callsign: string
    type: string
    operator: string
    country: string
    category: 'whitelisted'|null
    seenCount: number|null
    lastSeen: string
    photographed: number|null
    photographer: string|null
  }
}