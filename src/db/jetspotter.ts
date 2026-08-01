import path from 'path'
import fs from 'fs'
import Database from 'better-sqlite3'

const dbDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir)
const dbPth = path.join(dbDir, 'jetspotter.db')

export const JsDb = new Database(dbPth, { readonly:true })