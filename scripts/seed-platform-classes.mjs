/** Seed twenty starter class records without replacing classes edited in the admin UI.
 * Usage: node scripts/seed-platform-classes.mjs [--dry-run]
 */
import "dotenv/config";
import { Pool } from "pg";

const platformTutorId = "correct-student-platform-tutor";
const templates = [
  {
    language: "Yoruba",
    titles: ["First Yoruba Greetings", "The Friendly Neighbour", "Counting Together", "A Visit to the Market", "The Story of a Helpful Friend"],
    topics: ["greet a friend, introduce yourself, and respond politely", "follow a short story about meeting a new neighbour", "count familiar objects through rhythm and repetition", "ask simple questions and respond during a market visit", "read a longer story about friendship, choices, and kindness"],
    stories: ["A child meets a new neighbour and finds a kind way to say hello.", "Two friends work together to help someone who has lost a favourite book."],
  },
  {
    language: "Igbo",
    titles: ["Introducing Yourself in Igbo", "A Family Celebration", "The Number Song", "Planning a Play Day", "The Shared Garden"],
    topics: ["say your name, ask someone else's name, and introduce a friend", "follow a short story about preparing for a family celebration", "practise counting and number patterns with a song", "make and respond to simple plans with friends", "read a longer story about teamwork and caring for a shared garden"],
    stories: ["A family prepares a celebration and gives every child a useful job.", "Children care for a shared garden and solve a problem together."],
  },
  {
    language: "Hausa",
    titles: ["Hausa Words for Everyday Things", "The Lost Kite", "Clap and Count", "Finding the Way", "The Market Map"],
    topics: ["name common objects and use them in short sentences", "follow a short story about looking for a lost kite", "count objects and keep time with a rhythmic song", "ask for and give simple directions", "read a longer story about finding a route through a busy market"],
    stories: ["A kite goes missing and friends retrace their steps to find it.", "A child uses a hand-drawn map to help a friend find a market stall."],
  },
  {
    language: "Fulani",
    titles: ["Getting to Know Someone", "A New Friend at School", "The Counting Circle", "Talking About Your Day", "The Library Journey"],
    topics: ["introduce yourself and ask friendly questions", "follow a short story about welcoming a new pupil", "practise numbers and repeated phrases in a song", "describe a daily routine and ask about someone else's", "read a longer story about curiosity and a visit to the library"],
    stories: ["A new pupil arrives at school and classmates help them feel welcome.", "Friends travel to a library and choose books to share with one another."],
  },
];

const patterns = [
  { contentType: "Lesson", mediaType: "Text", level: "Beginners", plans: ["free"], duration: 12 },
  { contentType: "Story", mediaType: "Audio", level: "Beginners", plans: ["starter"], duration: 15 },
  { contentType: "Song", mediaType: "Video", level: "Beginners", plans: ["plus"], duration: 10 },
  { contentType: "Lesson", mediaType: "Video", level: "Intermediate", plans: ["starter", "plus"], duration: 20 },
  { contentType: "Story", mediaType: "Text", level: "Advanced", plans: ["premium"], duration: 25 },
];

function slug(value) {
  return `platform-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function description(language, pattern, topic) {
  const format = pattern.contentType.toLowerCase();
  return `In this ${language} ${format}, children will ${topic}. Start by reading the example and trying the activity at a comfortable pace. Pause to repeat new ideas, talk about what they mean, and try them again with a friend or tutor. This class is designed for ${pattern.level.toLowerCase()} learners and takes about ${pattern.duration} minutes.`;
}

function textMaterial(language, title, story, isStory) {
  if (isStory) return `${title}\n\n${story}\n\nAt first, the children do not know what to do. They listen to each other's ideas, choose a kind solution, and try it together. By the end of the day, everyone has learned something new.\n\nRead the story aloud with a tutor. Retell the beginning, middle, and end in ${language}. Then describe one choice the characters made and explain what you would do. Write or say two new sentences about the story.`;
  return `${title}\n\n1. Say your name and greet someone you know.\n2. Ask your tutor how to say three useful words for this topic in ${language}. Listen, repeat, and use each word in a short sentence.\n3. Practise a two-person conversation. Take turns asking and answering.\n4. Draw or write one thing you remember, then teach it to a friend.\n\nKeep practising until you can say the ideas in your own words.`;
}

const records = templates.flatMap(group => patterns.map((pattern, index) => {
  const title = group.titles[index];
  return {
    ...pattern, language: group.language, title, slug: slug(title),
    description: description(group.language, pattern, group.topics[index]),
    status: pattern.mediaType === "Text" ? "published" : "draft",
    material: pattern.mediaType === "Text" ? textMaterial(group.language, title, group.stories[index === 4 ? 1 : 0], pattern.contentType === "Story") : null,
  };
}));

if (process.argv.includes("--dry-run")) {
  console.table(records.map(({ title, language, contentType, mediaType, level, plans, status }) => ({ title, language, contentType, mediaType, level, plans: plans.join(", "), status })));
  process.exit(0);
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  const lookups = {};
  for (const [key, table, column] of [
    ["language", "languages", "name"], ["contentType", "content_types", "name"],
    ["mediaType", "media_types", "name"], ["level", "levels", "name"],
    ["plan", "pricing_plans", "plan_key"],
  ]) {
    const { rows } = await client.query(`SELECT id, ${column} AS key FROM ${table}`);
    lookups[key] = new Map(rows.map(row => [row.key.toLowerCase(), row.id]));
  }
  const { rows: tutors } = await client.query('SELECT id FROM "user" WHERE id = $1 AND role = $2', [platformTutorId, "tutor"]);
  if (!tutors.length) throw new Error("The permanent Correct Student tutor is missing.");
  let created = 0, skipped = 0;
  for (const item of records) {
    const ids = {
      language: lookups.language.get(item.language.toLowerCase()),
      contentType: lookups.contentType.get(item.contentType.toLowerCase()),
      mediaType: lookups.mediaType.get(item.mediaType.toLowerCase()),
      level: lookups.level.get(item.level.toLowerCase()),
    };
    const planIds = item.plans.map(key => lookups.plan.get(key));
    if (Object.values(ids).some(id => !id) || planIds.some(id => !id)) throw new Error(`Missing lookup row for ${item.title}.`);
    const { rows } = await client.query(
      `INSERT INTO classes (slug, title, description, duration_minutes, language_id, content_type_id, media_type_id, level_id, primary_tutor_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (slug) DO NOTHING RETURNING id`,
      [item.slug, item.title, item.description, item.duration, ids.language, ids.contentType, ids.mediaType, ids.level, platformTutorId, item.status],
    );
    if (!rows.length) { skipped++; continue; }
    const classId = rows[0].id;
    for (const planId of planIds) await client.query("INSERT INTO class_subscriptions (class_id, pricing_plan_id) VALUES ($1,$2)", [classId, planId]);
    if (item.material) await client.query("INSERT INTO class_materials (class_id, kind, content, sort_order) VALUES ($1,'text',$2,0)", [classId, item.material]);
    created++;
  }
  await client.query("COMMIT");
  console.log(`Platform classes: ${created} created, ${skipped} already present.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
