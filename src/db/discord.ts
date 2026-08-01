import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dbDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir)
const dbPth = path.join(dbDir, 'data.db')

export const db = new Database(dbPth)
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')


db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    guildId TEXT NOT NULL,
    channelId TEXT NOT NULL,
    messageId TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    repliedUser TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(userId);
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS roulette (
    userId TEXT PRIMARY KEY NOT NULL,
    points INTEGER NOT NULL DEFAULT 100,
    msgCount INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_rl_points ON roulette(points DESC);
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS gay (
    userId TEXT NOT NULL,
    percent INTEGER NOT NULL CHECK(percent BETWEEN 0 AND 100),
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (userId, percent)
  );

  CREATE INDEX IF NOT EXISTS idx_gay_top ON gay(percent, count DESC);
`)