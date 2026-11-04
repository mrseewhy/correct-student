import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { BlogCard } from "@/components/site/blog-card";
import { listBlogPosts } from "@/lib/data/dal/blog-posts";

export const instant = false;

export const metadata: Metadata = {
  title: "Our Blog",
  description:
    "Learning tips, language & culture stories, songs and play, and advice for parents — all about helping children learn African languages and English.",
};

export default async function BlogPage() {
  const ordered = await listBlogPosts(true);

  return (
    <section className="bg-linear-to-b from-secondary via-background to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight text-primary">
            Our Blog
          </h1>
          <p className="mt-4 text-lg text-foreground/80">
            Learning tips, language &amp; culture stories, songs and play, and
            advice for parents — all about helping children learn African
            languages and English.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {ordered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {ordered.length === 0 && (
          <div className="mt-12 rounded-3xl border border-border bg-card px-6 py-16 text-center">
            <h2 className="text-2xl">No posts yet</h2>
            <p className="mt-3 text-muted-foreground">
              Check back soon for new stories and learning tips.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
