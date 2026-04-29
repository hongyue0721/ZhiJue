import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'
import fs from 'fs'

type DbType = BetterSQLite3Database<typeof schema>

/** 懒初始化数据库连接，避免构建时执行 */
let _db: DbType | null = null
let _sqlite: Database.Database | null = null

/** 自动建表 SQL */
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '新对话',
  mode TEXT NOT NULL DEFAULT 'explore',
  stage TEXT NOT NULL DEFAULT 'basic_info',
  basic_info_completed INTEGER NOT NULL DEFAULT 0,
  basic_info TEXT,
  career_profile TEXT,
  recommendations TEXT,
  resume_data TEXT,
  interview_report TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  mode TEXT NOT NULL,
  structured_data TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  resume_id TEXT REFERENCES resumes(id),
  status TEXT NOT NULL DEFAULT 'in_progress',
  current_question_index INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 6,
  questions TEXT NOT NULL DEFAULT '[]',
  report TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
`

function initDB() {
  if (_db) return { db: _db, sqlite: _sqlite! }

  // 确保 data 目录存在
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const dbPath = process.env.DATABASE_URL?.replace('file:', '') || path.join(dataDir, 'zhijue.db')

  _sqlite = new Database(dbPath)

  // 启用 WAL 模式提升并发性能
  _sqlite.pragma('journal_mode = WAL')

  // 自动建表
  _sqlite.exec(CREATE_TABLES_SQL)

  _db = drizzle(_sqlite, { schema })

  return { db: _db, sqlite: _sqlite }
}

/** 获取数据库实例（懒初始化） */
export function getDB(): DbType {
  return initDB().db
}

/** 获取原始 SQLite 实例 */
export function getSQLite() {
  return initDB().sqlite
}

export const db = new Proxy({} as DbType, {
  get(_target, prop) {
    const realDb = getDB()
    return Reflect.get(realDb as object, prop)
  },
})
