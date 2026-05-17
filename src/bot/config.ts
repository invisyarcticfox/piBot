export const env = {
  bot: {
    id: process.env.BOT_ID,
    token: process.env.BOT_TOKEN
  },
  guild: {
    id: process.env.SERVER_ID,
    channels: {
      jetspotter: { id: process.env.JETSPOTTER_CHANNEL_ID },
      guestbook: { id: process.env.GUESTBOOK_CHANNEL_ID },
      vrchat: { id: process.env.VRCHAT_CHANNEL_ID }
    }
  },
  owner: { id: process.env.OWNER_ID },
  cloudflare: { guestbook: { auth: process.env.WORKER_GB_SECRET } }
}