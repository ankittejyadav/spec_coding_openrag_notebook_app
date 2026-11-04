import { DatabaseSync } from 'node:sqlite'
import path from 'path'

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'notebooklm.db')

class BetterSqliteWrapper {
  private db: DatabaseSync

  constructor(filePath: string) {
    this.db = new DatabaseSync(filePath)
  }

  close() {
    this.db.close()
  }

  pragma(sql: string) {
    try {
      this.db.exec(`PRAGMA ${sql}`)
    } catch {
      // ignore non-critical pragma errors
    }
  }

  exec(sql: string) {
    this.db.exec(sql)
  }

  prepare(sql: string) {
    const stmt = this.db.prepare(sql)
    return {
      all: (...params: any[]) => stmt.all(...params),
      get: (...params: any[]) => stmt.get(...params),
      run: (...params: any[]) => stmt.run(...params),
    }
  }
}

let _db: any = null

export function getDb(): any {
  if (_db) return _db
  _db = new BetterSqliteWrapper(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  migrate(_db)
  return _db
}

function migrate(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id                TEXT PRIMARY KEY,
      name              TEXT NOT NULL,
      openrag_filter_id TEXT NOT NULL DEFAULT '',
      created_at        TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sources (
      id               TEXT PRIMARY KEY,
      notebook_id      TEXT NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
      title            TEXT NOT NULL,
      type             TEXT NOT NULL,
      url              TEXT,
      openrag_filename TEXT NOT NULL,
      created_at       TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notes (
      id           TEXT PRIMARY KEY,
      notebook_id  TEXT NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
      title        TEXT NOT NULL,
      type         TEXT NOT NULL CHECK(type IN ('manual','chat','overview','table','mindmap')),
      body         TEXT,
      table_data   TEXT,
      mind_map_data TEXT,
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id          TEXT PRIMARY KEY,
      notebook_id TEXT NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
      role        TEXT NOT NULL,
      content     TEXT NOT NULL,
      sources     TEXT,
      saved       INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS _migrations (
      id     TEXT PRIMARY KEY,
      ran_at TEXT NOT NULL
    );
  `)

  function hasMigration(id: string): boolean {
    return !!db.prepare('SELECT 1 FROM _migrations WHERE id = ?').get(id)
  }

  function markMigration(id: string): void {
    db.prepare('INSERT OR IGNORE INTO _migrations (id, ran_at) VALUES (?, ?)').run(id, new Date().toISOString())
  }

  const nbCols = db.prepare("PRAGMA table_info(notebooks)").all() as Array<{ name: string }>
  if (!nbCols.some((col: any) => col.name === 'openrag_chat_id')) {
    db.exec(`ALTER TABLE notebooks ADD COLUMN openrag_chat_id TEXT`)
  }

  const columns = db.prepare("PRAGMA table_info(sources)").all() as Array<{ name: string }>
  const hasContentHash = columns.some((col: any) => col.name === 'content_hash')
  const hasRawText = columns.some((col: any) => col.name === 'raw_text')

  if (!hasContentHash) {
    db.exec(`ALTER TABLE sources ADD COLUMN content_hash TEXT`)
  }

  if (!hasRawText) {
    db.exec(`ALTER TABLE sources ADD COLUMN raw_text TEXT`)
  }

  if (!hasMigration('drop_sources_type_check')) {
    markMigration('drop_sources_type_check')
  }
}

export function makeTestDb(): any {
  const db = new BetterSqliteWrapper(':memory:')
  migrate(db)
  return db
}
