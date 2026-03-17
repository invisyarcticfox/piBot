export const env = {
  bot: {
    id: process.env.BOT_ID,
    token: process.env.BOT_TOKEN
  },
  guild: {
    id: process.env.SERVER_ID,
    channels: {
      jetspotter: { id: process.env.JETSPOTTER_CHANNEL_ID }
    }
  },
  owner: { id: process.env.OWNER_ID }
}