import { classes, products, productPrice } from "@/lib/catalog";
import { languageOptions } from "@/lib/onboarding";

export type AdminRecord = { id: string; title: string; subtitle: string; status: string; details: { label: string; value: string }[] };
type Section = { slug: string; label: string; description: string; columns: [string, string, string]; records: AdminRecord[] };
const record = (id: string, title: string, subtitle: string, status: string, details: [string, string][]): AdminRecord => ({ id, title, subtitle, status, details: details.map(([label, value]) => ({ label, value })) });

export const adminSections: Section[] = [
  { slug: "newsletter", label: "Newsletter", description: "Subscriber records will be available after administrator access is connected.", columns: ["Subscriber", "Joined", "Status"], records: [] },
  { slug: "languages", label: "Languages", description: "Languages currently available across the learning catalog.", columns: ["Language", "Classes", "Status"], records: languageOptions.map((item) => record(item.id, item.label, `${classes.filter((entry) => entry.language?.toLowerCase() === item.id).length} classes`, "Active", [["Language", item.label], ["Classes", String(classes.filter((entry) => entry.language?.toLowerCase() === item.id).length)], ["Availability", "Published"]])) },
  { slug: "students", label: "Students", description: "Learner accounts, languages and current plans.", columns: ["Student", "Language · Plan", "Status"], records: [
    record("amaka-obi", "Amaka Obi", "Yoruba · Starter", "Active", [["Email", "amaka.obi@example.com"], ["Language", "Yoruba"], ["Plan", "Starter"], ["Joined", "14 October 2026"]]),
    record("ibrahim-yusuf", "Ibrahim Yusuf", "Hausa · Free", "Active", [["Email", "ibrahim.yusuf@example.com"], ["Language", "Hausa"], ["Plan", "Free"], ["Joined", "19 October 2026"]]),
    record("nkem-nwosu", "Nkem Nwosu", "Igbo · Plus", "Active", [["Email", "nkem.nwosu@example.com"], ["Language", "Igbo"], ["Plan", "Plus"], ["Joined", "8 October 2026"]]),
  ] },
  { slug: "tutors", label: "Tutors", description: "Teaching profiles and language specialties.", columns: ["Tutor", "Specialty", "Status"], records: [
    record("folake-adeyemi", "Folake Adeyemi", "Yoruba · 2 classes", "Active", [["Email", "folake.adeyemi@example.com"], ["Languages", "Yoruba"], ["Classes", "2"], ["Joined", "3 September 2026"]]),
    record("emeka-okoro", "Emeka Okoro", "Igbo · 2 classes", "Active", [["Email", "emeka.okoro@example.com"], ["Languages", "Igbo"], ["Classes", "2"], ["Joined", "12 September 2026"]]),
    record("amina-garba", "Amina Garba", "Hausa · 1 class", "Active", [["Email", "amina.garba@example.com"], ["Languages", "Hausa"], ["Classes", "1"], ["Joined", "28 September 2026"]]),
  ] },
  { slug: "classes", label: "Classes", description: "Lessons, stories and songs available to learners.", columns: ["Class", "Language · Level", "Type"], records: classes.map((item) => record(item.slug, item.title, `${item.language} · ${item.level}`, item.type, [["Language", item.language ?? ""], ["Level", item.level ?? ""], ["Duration", item.duration ?? ""], ["Description", item.description]])) },
  { slug: "products", label: "Products", description: "Physical and digital resources in the shop.", columns: ["Product", "Format · Price", "Status"], records: products.map((item) => record(item.slug, item.title, `${item.format} · ${productPrice(item.price ?? 0)}`, "Available", [["Type", item.type], ["Format", item.format ?? ""], ["Price", productPrice(item.price ?? 0)], ["Description", item.description]])) },
  { slug: "orders", label: "Orders", description: "Purchases and fulfillment across the shop.", columns: ["Order", "Customer · Total", "Status"], records: [
    record("CS-1042", "CS-1042", "Amaka Obi · ₦5,000", "Processing", [["Customer", "Amaka Obi"], ["Item", "Yoruba learning resources"], ["Total", "₦5,000"], ["Placed", "25 October 2026"], ["Fulfillment", "Processing"]]),
    record("CS-1041", "CS-1041", "Nkem Nwosu · ₦3,000", "Completed", [["Customer", "Nkem Nwosu"], ["Item", "Digital language guide"], ["Total", "₦3,000"], ["Placed", "22 October 2026"], ["Fulfillment", "Completed"]]),
  ] },
  { slug: "coupons", label: "Coupons", description: "Discount codes, validity periods and redemption limits.", columns: ["Code", "Discount · Usage", "Status"], records: [
    record("WELCOME10", "WELCOME10", "10% off · 12 of 100 used", "Active", [["Discount", "10%"], ["Applies to", "First shop order"], ["Used", "12 of 100"], ["Expires", "31 December 2026"]]),
    record("LEARN20", "LEARN20", "20% off · 6 of 50 used", "Active", [["Discount", "20%"], ["Applies to", "Starter or Plus plan"], ["Used", "6 of 50"], ["Expires", "30 November 2026"]]),
  ] },
  { slug: "activities", label: "Activities", description: "Recent changes and events across the platform.", columns: ["Activity", "When", "Category"], records: [
    record("contact-received", "New contact message received", "26 October 2026 · 10:42", "Contact", [["Event", "Message received"], ["From", "Chioma Eze"], ["Time", "26 October 2026, 10:42"]]),
    record("order-1042", "Order CS-1042 placed", "25 October 2026 · 14:18", "Orders", [["Event", "Order placed"], ["Order", "CS-1042"], ["Time", "25 October 2026, 14:18"]]),
    record("subscriber-added", "Newsletter subscriber added", "24 October 2026 · 09:15", "Newsletter", [["Event", "Subscription received"], ["Subscriber", "Ada Okafor"], ["Time", "24 October 2026, 09:15"]]),
  ] },
];

export const findAdminSection = (slug: string) => adminSections.find((section) => section.slug === slug);
