import 'dotenv/config'

export const env:Record<string, string> = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  GUILD_ID: process.env.GUILD_ID!,
  JS_CHANNEL: process.env.JETSPOTTER_CHANNEL!
}

export const conf = {
  BOT_ID: '1445620355711373436',
  OWNER_ID: '470193291053498369'
}