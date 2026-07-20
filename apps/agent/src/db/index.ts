// ArcGent Database — Drizzle ORM + SQLite
// Uses Bun's built-in SQLite driver — zero dependencies

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

const DB_PATH = process.env.DB_PATH || "./data/arcgent.db";

// Ensure directory exists
const dir = dirname(DB_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

// Singleton DB connection
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = new Database(DB_PATH);
    // DELETE mode — WAL breaks on some VPS filesystems with SQLITE_IOERR_SHORT_READ
    sqlite.run("PRAGMA journal_mode=DELETE;");
    sqlite.run("PRAGMA foreign_keys=ON;");
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

// Reset DB connection (for tests)
export function resetDb() {
  _db = null;
}

export { schema };
export type ArcGentDB = ReturnType<typeof getDb>;
