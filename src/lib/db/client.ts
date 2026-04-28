import Database from 'better-sqlite3'
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'
import fs from 'fs'

type DbType = BetterSQLite3Database<typeof schema>

/** 懒初始化数据库连接，避免构建时执行 */
let _db: DbType | null = null
let _sqlite: Database.Database | null = null

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

// 向后兼容的导出（通过 Proxy 懒初始化）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = new Proxy({} as DbType, {
  get(_target, prop) {
    const realDb = getDB()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (realDb as any)[prop]
  },
})
