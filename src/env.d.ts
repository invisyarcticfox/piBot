declare namespace NodeJS {
  interface ProcessEnv {
    BOT_TOKEN: string
    BOT_ID: string
    SERVER_ID: string
    OWNER_ID: string
    JETSPOTTER_CHANNEL_ID: string
    GUESTBOOK_CHANNEL_ID: string
    VRCHAT_CHANNEL_ID: string
    WORKER_GB_SECRET: string
  }
}