import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { formatPostDate } from "@/lib/blog";
import { BlogBody } from "@/components/site/blog-body";
import { Container } from "@/components/site/container";
import { DEFAULT_BLOG_IMAGE, getPublishedBlogPostBySlug } from "@/lib/data/dal/blog-posts";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  return <section className="bg-linear-to-b from-secondary via-background to-background py-12 md:py-20">
    <Container>
      <Link href="/blog" className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring">
        <ArrowLeft className="size-4" aria-hidden /> All blog posts
      </Link>

      <article className="w-full">
        <header className="mt-10 w-full text-center md:mt-12">
          <h1 className="text-4xl leading-tight sm:text-5xl">{post.title}</h1>
          <time dateTime={post.createdAt.toISOString()} className="mt-5 block text-sm text-muted-foreground">{formatPostDate(post.createdAt.toISOString())}</time>
        </header>

        <div className="relative mt-10 h-56 w-full overflow-hidden rounded-3xl border border-border bg-secondary shadow-xl shadow-primary/5 sm:h-72 lg:h-88">
          <Image
            src={post.featuredImage ?? DEFAULT_BLOG_IMAGE}
            alt={post.imageAlt || post.title}
            fill
            unoptimized
            priority
            sizes="(min-width: 1536px) 1504px, 100vw"
            className="object-cover object-center"
          />
        </div>

        <div className="mt-10 w-full rounded-3xl border border-border bg-card px-6 py-8 shadow-sm sm:px-10 sm:py-12 md:mt-12">
          <BlogBody body={post.body} />
        </div>
      </article>
    </Container>
  </section>;
}
