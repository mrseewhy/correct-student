import "server-only";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & { databasePool?: Pool };
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
const pool = globalForDb.databasePool ??= new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  connectionTimeoutMillis: 5000,
});
export const db = drizzle({ client: pool });
