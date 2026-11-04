import { languageOptions } from "@/lib/onboarding";

export const classFilters = [
  { key: "language", label: "Language", options: languageOptions.map((item) => item.label) },
  { key: "type", label: "Class type", options: ["Lesson", "Song", "Story"] },
  { key: "level", label: "Level", options: ["Beginner", "Intermediate", "Advanced"] },
];
export const shopFilters = [
  { key: "type", label: "Product type", options: ["Book", "Bag", "eBook"] },
  { key: "format", label: "Format", options: ["Physical", "Digital"] },
];
export type CatalogItem = {
  slug: string; title: string; description: string; type: string;
  language?: string; level?: string; format?: string; image?: string;
  duration?: string; price?: number; details: string; highlights: string[];
  specifications?: { label: string; value: string }[];
  outline?: { title: string; duration: string }[];
};

// Demo items only; prices, descriptions and specifications are editable here.
export const products: CatalogItem[] = [
  { slug: "first-words-book", title: "My First Yoruba Words", type: "Book", format: "Physical", price: 6500, description: "An illustrated companion for your first everyday words.", details: "Explore greetings, family, food and familiar objects through an illustrated book designed for shared reading. English meanings sit alongside Yoruba words, making it an inviting starting point for learners and families.", highlights: ["Illustrated everyday vocabulary", "Yoruba words with English meanings", "Simple prompts for reading together"], specifications: [{ label: "Language", value: "Yoruba & English" }, { label: "Format", value: "Paperback · 32 pages" }, { label: "Delivery", value: "Physical delivery" }] },
  { slug: "everyday-learning-bag", title: "Everyday Learning Bag", type: "Bag", format: "Physical", price: 12000, description: "A little room for books, big ideas and daily adventures.", details: "Keep your favourite learning materials together in a simple everyday bag. This demo product brings the Correct Student spirit beyond the screen and into your learner’s daily routine.", highlights: ["Room for books and stationery", "Comfortable everyday carry", "A simple design for school or outings"], specifications: [{ label: "Material", value: "Canvas" }, { label: "Colour", value: "Natural" }, { label: "Delivery", value: "Physical delivery" }] },
  { slug: "igbo-story-ebook", title: "Little Stories in Igbo", type: "eBook", format: "Digital", price: 3500, description: "Short stories to read, revisit and share together.", details: "Discover a collection of short beginner-friendly stories in Igbo with English support. Read together, talk about the characters and return to favourite moments whenever you like.", highlights: ["Five short illustrated stories", "Igbo with English support", "Reading prompts after each story"], specifications: [{ label: "Language", value: "Igbo & English" }, { label: "File format", value: "PDF · 24 pages" }, { label: "Delivery", value: "Digital download" }] },
  { slug: "hausa-activity-book", title: "Hausa Activity Book", type: "Book", format: "Physical", price: 5500, description: "Make room for a little drawing, matching and discovery.", details: "Turn new words into playful activities with a book of matching exercises, drawing prompts and simple vocabulary games. A companion for beginners exploring Hausa alongside English.", highlights: ["Matching and drawing activities", "Everyday Hausa vocabulary", "Space to practise and create"], specifications: [{ label: "Language", value: "Hausa & English" }, { label: "Format", value: "Paperback · 40 pages" }, { label: "Delivery", value: "Physical delivery" }] },
  { slug: "language-tote", title: "Carry Your Culture Tote", type: "Bag", format: "Physical", price: 8000, description: "Take a little love for language wherever you go.", details: "A reusable tote for books, small essentials and trips to the library. A simple piece of merchandise for families who want to celebrate their learning journey.", highlights: ["Reusable everyday tote", "Space for your favourite books", "Lightweight and easy to carry"], specifications: [{ label: "Material", value: "Cotton" }, { label: "Colour", value: "Natural" }, { label: "Delivery", value: "Physical delivery" }] },
  { slug: "fulani-first-phrases", title: "First Phrases in Fulani", type: "eBook", format: "Digital", price: 3000, description: "A digital guide to a few friendly first conversations.", details: "Begin with greetings and simple everyday phrases. This digital guide offers an approachable introduction to Fulani alongside English, with prompts to practise together.", highlights: ["Beginner conversation prompts", "English meanings alongside phrases", "Read on a phone, tablet or computer"], specifications: [{ label: "Language", value: "Fulani & English" }, { label: "File format", value: "PDF · 20 pages" }, { label: "Delivery", value: "Digital download" }] },
];

export const classes: CatalogItem[] = [
  { slug: "yoruba-first-greetings", title: "Your first Yoruba greetings", language: "Yoruba", type: "Lesson", level: "Beginner", duration: "12 minutes", image: "/img/hero3.jpg", description: "Start a conversation with a few friendly everyday words.", details: "Explore everyday greetings and practise saying them in a simple exchange. This introductory lecture gives new learners a gentle starting point for speaking Yoruba alongside English.", highlights: ["Recognise common greetings", "Practise a short greeting exchange", "Connect new phrases with English meanings"] },
  { slug: "igbo-family-story", title: "A story about family", language: "Igbo", type: "Story", level: "Beginner", duration: "8 minutes", image: "/img/about-1.jpg", description: "Meet a family and discover familiar words in a short story.", details: "Follow a short family story and explore the words used to describe people and everyday moments. English support helps learners connect the story with its meaning.", highlights: ["Explore family vocabulary", "Follow a short story", "Answer simple questions about the characters"] },
  { slug: "hausa-sing-along", title: "Words with a little rhythm", language: "Hausa", type: "Song", level: "Beginner", duration: "6 minutes", image: "/img/hero2.jpg", description: "Listen, repeat and explore new sounds through a song.", details: "Discover a simple song and practise its repeating phrases. This lecture uses rhythm and repetition to invite beginners into the sounds of Hausa.", highlights: ["Listen for repeating words", "Explore the meaning of the chorus", "Practise sounds at your own pace"] },
  { slug: "fulani-everyday-conversations", title: "Everyday conversations", language: "Fulani", type: "Lesson", level: "Intermediate", duration: "18 minutes", image: "/img/teachers.jpg", description: "Build on the basics with questions and everyday replies.", details: "Move beyond a greeting and explore how to keep a short conversation going. This lecture is intended for learners who are already comfortable with introductory phrases.", highlights: ["Ask everyday questions", "Build longer replies", "Practise a short conversation"] },
  { slug: "yoruba-story-and-meaning", title: "Listen to the whole story", language: "Yoruba", type: "Story", level: "Advanced", duration: "20 minutes", image: "/img/inter.jpg", description: "Explore a longer narrative and discuss its meaning.", details: "Follow a longer story, consider its characters and talk about what it means. This lecture encourages confident learners to move beyond individual words and express their own interpretations.", highlights: ["Follow a longer narrative", "Discuss characters and themes", "Express an interpretation in your own words"] },
  { slug: "igbo-song-and-expression", title: "A song, a story, a feeling", language: "Igbo", type: "Song", level: "Intermediate", duration: "10 minutes", image: "/img/mission.jpg", description: "Look beyond the melody to the expressions in a song.", details: "Explore how a song uses words to express an idea or feeling. Learners build on familiar vocabulary and look at the meaning behind repeating lines.", highlights: ["Explore phrases in context", "Discuss the meaning of a song", "Practise familiar and new expressions"] },
].map((item) => ({ ...item, outline: [
  { title: "Introduction and what to expect", duration: "Part 1" },
  { title: item.type === "Lesson" ? "Explore the words and phrases" : item.type === "Story" ? "Read and follow the story" : "Listen and explore the song", duration: "Part 2" },
  { title: "Practise and reflect", duration: "Part 3" },
] }));

/** Formats a naira price; unpriced demo items fall back to an enquiry message. */
export function productPrice(value?: number) {
  return value === undefined ? "Price on request" : `₦${value.toLocaleString("en-GB")}`;
}
