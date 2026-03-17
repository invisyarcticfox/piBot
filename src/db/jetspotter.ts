import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dataDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const dbPath = path.join(dataDir, 'seen.db')
export const jsDb = new Database(dbPath, { readonly:true })