import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dataDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const dbPath = path.join(dataDir, 'messages.db')
export const db = new Database(dbPath)


db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    guildId TEXT NOT NULL,
    channelId TEXT NOT NULL,
    messageId TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    content TEXT,
    timestamp INTEGER NOT NULL,
    repliedUser TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_channel ON messages(channelId);
  CREATE INDEX IF NOT EXISTS idx_user ON messages(userId);
  CREATE INDEX IF NOT EXISTS idx_timestamp ON messages(timestamp);
`)