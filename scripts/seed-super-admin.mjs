// Seeds (or repromotes) the first super-admin account.
// Usage: node scripts/seed-super-admin.mjs <email> <name> <username> <password>
// Uses the same hashPassword better-auth signs in with, so the
// credential account is directly sign-in-able.

import "dotenv/config";
import { Pool } from "pg";
import { hashPassword, generateRandomString } from "better-auth/crypto";

const [emailArg, nameArg, usernameArg, passwordArg] = process.argv.slice(2);

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
if (!emailArg || !nameArg || !usernameArg || !passwordArg) {
  console.error("Usage: node scripts/seed-super-admin.mjs <email> <name> <username> <password>");
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
const name = nameArg.trim();
const username = usernameArg.trim().toLowerCase();
const password = passwordArg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

try {
  const passwordHash = await hashPassword(password);
  const userId = generateRandomString(32);

  const existing = await pool.query("select id from \"user\" where email = $1", [email]);
  if ((existing.rowCount ?? 0) > 0) {
    await pool.query(
      "update \"user\" set role = $1, banned = false, ban_reason = null, ban_expires = null where email = $2",
      ["super-admin", email],
    );
    console.log(`Existing user ${email} promoted to super-admin.`);
  } else {
    await pool.query(
      `insert into "user" (id, name, email, email_verified, username, display_username, subscription, role, banned)
       values ($1, $2, $3, true, $4, $4, 'free', 'super-admin', false)`,
      [userId, name, email, username],
    );
    await pool.query(
      `insert into "account" (id, account_id, provider_id, user_id, password)
       values ($1, $2, 'credential', $3, $4)`,
      [generateRandomString(32), userId, userId, passwordHash],
    );
    console.log(`Created super-admin ${email} (${username}).`);
  }
} finally {
  await pool.end();
}
