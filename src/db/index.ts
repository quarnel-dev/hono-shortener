import { Database } from 'bun:sqlite'

import type { LinkRecord } from '../types/linkRecord.type'

const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : 'links.sqlite'
export const db = new Database(dbPath)

db.run('PRAGMA journal_mode = WAL;')

db.run(`
    CREATE TABLE IF NOT EXISTS links (
    code TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`)

export const dbLinks = {
  findByCode: (code: string) => {
    const query = db.query<LinkRecord, [string]>('SELECT * FROM links WHERE code = ?1')
    return query.get(code)
  },

  create: (code: string, url: string) => {
    const query = db.query('INSERT INTO links (code, url) VALUES (?1, ?2)')
    query.run(code, url)
  },

  incrementClicks: (code: string) => {
    const query = db.query('UPDATE links SET clicks = clicks + 1 WHERE code = ?1')
    query.run(code)
  },

  findAll: () => {
    const query = db.query<LinkRecord, []>('SELECT * FROM links ORDER BY created_at DESC')
    return query.all()
  },

  delete: (code: string) => {
    const query = db.query('DELETE FROM links WHERE code = ?1')
    return query.run(code)
  },
}
