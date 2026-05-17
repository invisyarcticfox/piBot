export type jsRes = {
  category: string
  embed: {
    color: number
    fields: { name:string, value:string, inline?:boolean }[]
    image?: { url:string } | undefined
    footer: { text:string }
  },
  buttons: { name:EmoteName, link:string|null, row:number }[]
}

export type GbRes = {
  id: string
  name: string|null
  message: string
  timestamp: string
}

export type vrcRes = {
  checkedAt: string
  group: {
    id: string
    name: string
    iconUrl: string
    onlineMembers: number
    totalMembers: number
  }
  instances: {
    worldId: string
    worldName: string
    instanceId: string
    userCount: number
    capacity: number
  }[]
}