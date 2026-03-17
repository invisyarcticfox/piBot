import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dataDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const dbPath = path.join(dataDir, 'messages.db')
export const msgDb = new Database(dbPath)


msgDb.pragma('journal_mode = WAL')
msgDb.pragma('synchronous = NORMAL')

msgDb.exec(`
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