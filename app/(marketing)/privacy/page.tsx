import type { Metadata } from "next";

import { PolicyLayout } from "@/components/site/policy-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Understand how your information is handled and the choices you have.",
};

// Sample text: replace with your real policy
const sections = [
  {
    title: "1. Information we collect",
    body: "We collect the details you give us when you sign up, such as your name, username and email address, along with information about how you use Correct Student.",
  },
  {
    title: "2. How we use your information",
    body: "We use your information to run your account, deliver lessons, stories and songs, improve the platform, and contact you about your account.",
  },
  {
    title: "3. Children's privacy",
    body: "Correct Student is built for children, so we take extra care with their information. Parents and guardians can contact us at any time to review or delete their child's data.",
  },
  {
    title: "4. Sharing your information",
    body: "We do not sell your personal information. We only share it with trusted services that help us run Correct Student, or when the law requires it.",
  },
  {
    title: "5. Keeping your information safe",
    body: "We use reasonable measures to protect your information, but no online service can be completely secure.",
  },
  {
    title: "6. Your choices",
    body: "You can ask to see, correct or delete your information at any time by contacting us.",
  },
  {
    title: "7. Contact",
    body: "If you have questions about this policy, please reach out through our Contact Us page.",
  },
];

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description="Understand how your information is handled and the choices you have."
      updated="November 2026"
      sections={sections}
      related={{ title: "Read our Terms and Conditions", href: "/terms" }}
    />
  );
}
