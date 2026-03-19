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
