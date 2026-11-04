import "dotenv/config";
import pg from "pg";

const posts = [
  {
    slug: "make-language-learning-part-of-everyday-life",
    title: "Make language learning part of everyday life",
    excerpt: "Small, repeatable moments can help a new language become part of family life.",
    category: "Learning tips", image: "/img/hero3.jpg", alt: "A child learning with headphones",
    sections: [
      ["Start with one familiar moment", "Choose a moment that already happens each day, such as a morning greeting or setting the table. Add one word or short phrase, then use it in the same moment tomorrow. A familiar routine gives the language a place to live.", "Keep the invitation gentle. Listening counts as participation, and a child who hears a phrase many times may choose to try it when they feel ready."],
      ["Repeat with variety", "Use the same phrase while speaking, singing, and reading a short story. These different settings help a learner recognise it without turning repetition into a drill.", "Ask family members to use the phrase naturally. A word becomes more useful when it belongs to a real conversation."],
      ["Notice progress", "Celebrate recognition as well as pronunciation. If your learner understands a greeting or points to the right object, that is a meaningful step.", "A few minutes each day is enough to begin. Consistency and warmth are more useful than a perfect lesson plan."],
    ],
  },
  {
    slug: "stories-connect-us-to-our-roots",
    title: "The stories that connect us to our roots",
    excerpt: "Family memories create natural openings for language, identity, and belonging.",
    category: "Language & culture", image: "/img/about-1.jpg", alt: "A shared moment of learning",
    sections: [
      ["Begin close to home", "Tell a story about a favourite meal, a visit to a relative, or a game you played when you were young. Personal details give children something concrete to imagine and ask about.", "There is no need to perform a polished story. A simple memory, shared honestly, is enough."],
      ["Keep meaningful words", "Names, greetings, and expressions often carry meaning that is difficult to replace. Say them in their original language and explain them in the context of the story.", "If you are unsure of a word, ask someone who knows it. Looking for an answer together can show a learner that curiosity is part of language learning."],
      ["Invite a retelling", "Ask your learner to draw a scene, tell their favourite part, or ask an older relative for another version. Each retelling helps the words connect to people and places.", "The goal is a continuing conversation, not a quiz about every detail."],
    ],
  },
  {
    slug: "bring-songs-into-language-practice",
    title: "A little rhythm, a few new words",
    excerpt: "Songs make listening and repetition feel playful and memorable.",
    category: "Songs & play", image: "/img/hero2.jpg", alt: "A learner exploring an activity",
    sections: [
      ["Choose a short chorus", "Begin with a song that repeats a few clear words. Listen together once before trying to sing. Invite your learner to point out a sound or word they noticed.", "Learning the whole song is unnecessary. One line can give you plenty to explore."],
      ["Move with the meaning", "Clap to the rhythm, act out an action, or point to an object named in the song. Movement gives a new word another way to make sense.", "Leave room for different kinds of participation. Some learners want to sing; others prefer to listen and move."],
      ["Use a word later", "Take one word from the chorus into another part of the day. Hearing it outside the song helps a learner understand how it works in ordinary speech.", "Return to favourite songs when they ask. Enjoyment is a good reason to keep practising."],
    ],
  },
  {
    slug: "support-a-beginner-without-pressure",
    title: "Helping a beginner find their confidence",
    excerpt: "Patience and encouragement make first attempts in a new language feel welcome.",
    category: "For parents", image: "/img/mission.jpg", alt: "A moment of guided learning",
    sections: [
      ["Learn alongside them", "Try an unfamiliar phrase together. If it feels new to you too, say so. A shared attempt can take away the feeling that one person is being tested.", "Ask what your learner wants to say, perhaps a greeting for a grandparent or a word for a favourite food."],
      ["Respond warmly", "Let a learner finish speaking before offering help. You can repeat a phrase naturally in your reply instead of interrupting every mistake.", "Praise the effort to try. Confidence grows when another attempt feels safe."],
      ["Follow curiosity", "A story may be inviting one day and a song the next. Offer choices and notice what draws your learner in.", "The aim is to build an ongoing relationship with the language, one comfortable step at a time."],
    ],
  },
  {
    slug: "five-ways-to-practise-a-new-greeting",
    title: "Five ways to practise a new greeting",
    excerpt: "Turn one greeting into a week of short, useful conversations.",
    category: "Learning tips", image: "/img/teachers.jpg", alt: "Teachers supporting language learners",
    sections: [
      ["Use it at the door", "Choose one greeting and say it when someone arrives. Let your learner hear how different people respond before asking them to join in."],
      ["Try a call and response", "Say the greeting and pause for a reply. Switch roles so the learner can begin the exchange when they wish."],
      ["Bring in a toy", "Let a favourite toy greet another toy. A pretend conversation gives the phrase a playful purpose."],
      ["Ask a relative", "Invite a relative who speaks the language to share how they use the greeting. Their voice gives the words a personal connection."],
      ["End the week with a story", "Make up a short scene where a character greets someone. Ask your learner what happens next. The greeting now belongs to a story they helped create."],
    ],
  },
  {
    slug: "make-room-for-more-than-one-language-at-home",
    title: "Make room for more than one language at home",
    excerpt: "A multilingual home can make space for every voice without demanding perfection.",
    category: "Language & culture", image: null, alt: "A child learning a language",
    sections: [
      ["Use the words you know", "You do not need to speak every language fluently to make it welcome at home. Start with words you know well, and connect them to real people and routines.", "When a child asks a question you cannot answer, explore it together or ask a speaker in your family or community."],
      ["Let languages meet", "A child may use words from two languages in one sentence. Respond to the meaning of what they say and give them more chances to hear each language in context.", "Songs, stories, calls with relatives, and everyday conversations can all have a place."],
      ["Keep connection at the centre", "Language carries memories and relationships. Make time for the people who use it, whether in person, by phone, or through a recorded story.", "Small moments of connection are more sustainable than a strict rule that no one enjoys."],
    ],
  },
];

function blocksFor(sections) {
  const blocks = [];
  for (const [heading, ...paragraphs] of sections) {
    blocks.push({ type: "heading", props: { level: 2 }, content: [{ type: "text", text: heading, styles: {} }] });
    for (const text of paragraphs) blocks.push({ type: "paragraph", content: [{ type: "text", text, styles: {} }] });
  }
  return JSON.stringify(blocks);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  for (const post of posts) {
    await client.query(`INSERT INTO blog_posts (slug, title, excerpt, category, body, featured_image, image_alt, published)
      VALUES ($1,$2,$3,$4,$5,$6,$7,true) ON CONFLICT (slug) DO NOTHING`,
      [post.slug, post.title, post.excerpt, post.category, blocksFor(post.sections), post.image, post.alt]);
  }
  const result = await client.query("SELECT count(*)::int AS count FROM blog_posts WHERE slug = ANY($1::text[]) AND published = true", [posts.map((post) => post.slug)]);
  console.log(`${result.rows[0].count} of ${posts.length} seed blog posts are published.`);
} finally {
  await client.end();
}
