// Seeds demo students and tutors into the database.
// Usage: node scripts/seed-users.mjs
//
// Creates 5 students per subscription plan (free, starter, plus, premium)
// and 5 tutors. All accounts use the password "Password123!" and are
// flagged email_verified so they can sign in immediately.

import "dotenv/config";
import { Pool } from "pg";
import { hashPassword, generateRandomString } from "better-auth/crypto";

const PLAN_VALUES = ["free", "starter", "plus", "premium"];
const PASSWORD = "Password123!";

function makeName(i) {
  const first = ["Ada", "Bola", "Chioma", "Dami", "Emeka", "Folake", "Goke", "Hassan", "Ifeoma", "Jide", "Kemi", "Lanre", "Maya", "Nosa", "Obi", "Pemi", "Qasim", "Rola", "Sola", "Tunde", "Uche", "Vera", "Wale", "Yemi", "Zainab"];
  const last = ["Adeyemi", "Bello", "Chukwu", "Danjuma", "Eze", "Fashola", "Garba", "Hassan", "Ibrahim", "Johnson", "Kalu", "Lawal", "Mohammed", "Nwosu", "Okafor", "Peters", "Quadri", "Raji", "Salami", "Tijani", "Umar", "Victor", "Williams", "Yusuf", "Zubair"];
  return `${first[(i * 7 + 3) % first.length]} ${last[(i * 11 + 5) % last.length]}`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

try {
  const passwordHash = await hashPassword(PASSWORD);
  let created = 0;
  let skipped = 0;

  async function createUser({ name, email, username, role, subscription }) {
    const existing = await pool.query('select id from "user" where email = $1', [email]);
    if ((existing.rowCount ?? 0) > 0) {
      skipped += 1;
      return;
    }
    const userId = generateRandomString(32);
    await pool.query(
      `insert into "user" (id, name, email, email_verified, username, display_username, subscription, role, banned)
       values ($1, $2, $3, true, $4, $5, $6, $7, false)`,
      [userId, name, email, username, name.split(" ")[0], subscription, role],
    );
    await pool.query(
      `insert into "account" (id, account_id, provider_id, user_id, password)
       values ($1, $2, 'credential', $3, $4)`,
      [generateRandomString(32), userId, userId, passwordHash],
    );
    created += 1;
  }

  for (const plan of PLAN_VALUES) {
    for (let i = 0; i < 5; i++) {
      const name = makeName(i + PLAN_VALUES.indexOf(plan) * 5, "student");
      const username = `${slugify(name)}.${plan}${i + 1}`;
      const email = `${username}@example.com`;
      await createUser({ name, email, username, role: "student", subscription: plan });
    }
  }

  for (let i = 0; i < 5; i++) {
    const name = makeName(30 + i, "tutor");
    const username = `${slugify(name)}.tutor${i + 1}`;
    const email = `${username}@example.com`;
    await createUser({ name, email, username, role: "tutor", subscription: "free" });
  }

  console.log(`Seed complete: ${created} created, ${skipped} skipped (already existed).`);
  console.log(`Shared password for seeded accounts: ${PASSWORD}`);
} finally {
  await pool.end();
}
