import type { Metadata } from "next";

import { PolicyLayout } from "@/components/site/policy-layout";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "A clear guide to using Correct Student, your account and our learning materials.",
};

// Sample text: replace with your real terms
const sections = [
  {
    title: "1. Acceptance of terms",
    body: "By creating an account or using Correct Student, you agree to these Terms and Conditions. If you do not agree, please do not use the service.",
  },
  {
    title: "2. Accounts",
    body: "You are responsible for keeping your login details safe and for all activity on your account. Parents and guardians are responsible for accounts created for children.",
  },
  {
    title: "3. Acceptable use",
    body: "You agree to use Correct Student only for learning and teaching, and not to misuse the platform, harass other users, or attempt to access accounts that are not yours.",
  },
  {
    title: "4. Content and ownership",
    body: "All lessons, stories, songs and other materials on Correct Student belong to us or our contributors. You may use them for personal learning but may not copy or resell them.",
  },
  {
    title: "5. Termination",
    body: "We may suspend or close accounts that break these terms. You can stop using Correct Student and close your account at any time.",
  },
  {
    title: "6. Changes to these terms",
    body: "We may update these terms from time to time. If we make important changes, we will let you know.",
  },
  {
    title: "7. Contact",
    body: "If you have questions about these terms, please reach out through our Contact Us page.",
  },
];

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      description="A clear guide to using Correct Student, your account and our learning materials."
      updated="November 2026"
      sections={sections}
      related={{ title: "Read our Privacy Policy", href: "/privacy" }}
    />
  );
}
