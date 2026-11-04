export const learner = {
  name: "Amaka Obi", email: "amaka.obi@example.com", language: "Yoruba", plan: "Starter",
  courses: [
    { slug: "yoruba-first-greetings", title: "Your first Yoruba greetings", progress: 65, next: "Practise a short greeting exchange" },
    { slug: "igbo-family-story", title: "A story about family", progress: 25, next: "Follow the story" },
  ],
  recent: ["Continued Your first Yoruba greetings", "Saved A story about family", "Joined the Starter plan"],
};

export const tutor = {
  name: "Folake Adeyemi", email: "folake.adeyemi@example.com", languages: ["Yoruba", "English"],
  students: [
    { name: "Amaka Obi", language: "Yoruba", course: "Your first Yoruba greetings", progress: 65 },
    { name: "Dayo Akinwale", language: "Yoruba", course: "Your first Yoruba greetings", progress: 40 },
    { name: "Tomi Balogun", language: "Yoruba", course: "Listen to the whole story", progress: 80 },
  ],
  schedule: [
    { day: "Monday", time: "10:00 AM", title: "Yoruba greetings", learner: "Amaka Obi" },
    { day: "Wednesday", time: "2:30 PM", title: "Story and meaning", learner: "Tomi Balogun" },
    { day: "Friday", time: "11:00 AM", title: "Speaking practice", learner: "Dayo Akinwale" },
  ],
  assignments: [
    { title: "Greeting practice", student: "Amaka Obi", status: "Awaiting review" },
    { title: "Story reflection", student: "Tomi Balogun", status: "Feedback sent" },
  ],
  messages: [
    { from: "Amaka Obi", subject: "Question about the greeting exercise", date: "28 Oct" },
    { from: "Tomi Balogun", subject: "Story activity submission", date: "26 Oct" },
  ],
};
