import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPostDate } from "@/lib/blog";
import { DEFAULT_BLOG_IMAGE, type BlogRow } from "@/lib/data/dal/blog-posts";

export function BlogCard({ post }: { post: BlogRow }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-16/10 overflow-hidden">
        <Image src={post.featuredImage ?? DEFAULT_BLOG_IMAGE} alt="" fill unoptimized sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
      </Link>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h2 className="text-xl leading-snug sm:text-2xl"><Link href={`/blog/${post.slug}`} className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-ring">{post.title}</Link></h2>
        <p className="mt-3 leading-7 text-muted-foreground">{post.excerpt}</p>
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground"><time dateTime={post.createdAt.toISOString()}>{formatPostDate(post.createdAt.toISOString())}</time></div>
          <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-sm text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring" aria-label={`Read ${post.title}`}>Read story <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
      </div>
    </article>
  );
}
