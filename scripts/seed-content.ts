import { Pool } from "pg";
import "dotenv/config";

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // Content types
    await pool.query(
      `INSERT INTO content_types (name, description) VALUES
        ('Lesson', 'Structured learning with guided instruction and practice.'),
        ('Story', 'Narrative-based learning through stories and tales.'),
        ('Song', 'Learning through music, rhythm, and repetition.')
      ON CONFLICT (name) DO NOTHING`
    );

    // Media types
    await pool.query(
      `INSERT INTO media_types (name, description) VALUES
        ('Video', 'Video-based media content.'),
        ('Text', 'Text-based media content.'),
        ('Audio', 'Audio-based media content.')
      ON CONFLICT (name) DO NOTHING`
    );

    // Levels
    await pool.query(
      `INSERT INTO levels (name, description) VALUES
        ('Beginners', 'For learners just starting out with no prior knowledge.'),
        ('Intermediate', 'For learners with some foundational knowledge.'),
        ('Advanced', 'For learners seeking mastery and fluency.')
      ON CONFLICT (name) DO NOTHING`
    );

    // Languages
    await pool.query(
      `INSERT INTO languages (name, code, is_active) VALUES
        ('Yoruba', 'yoruba', true),
        ('Igbo', 'igbo', true),
        ('Hausa', 'hausa', true),
        ('Fulani', 'fulani', true)
      ON CONFLICT (name) DO NOTHING`
    );

    console.log("Seed data inserted successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
