import type { Metadata } from "next";

import { Hero } from "@/components/site/hero";
import { LanguageIntro } from "@/components/site/language-intro";

export const metadata: Metadata = {
  description:
    "Correct Student helps children learn African languages and English side by side, through lessons, stories and songs.",
};

const Index = () => {
  return (
    <div>
      <Hero />
      <LanguageIntro />
    </div>
  );
};

export default Index;
