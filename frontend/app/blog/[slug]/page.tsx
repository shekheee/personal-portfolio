import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ArrowLeft, Clock, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Portfolio Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen pt-24 pb-20">
      <article className="section-container max-w-2xl">
        {/* Back */}
        <Link
          href="/#blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors mb-8"
        >
          <ArrowLeft size={12} />
          back to blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="font-mono">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1"><Clock size={11} /> {post.readingTime} min read</span>
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-[var(--border)] font-mono">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>
        </header>

        {/* MDX Content */}
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none
          prose-headings:text-[var(--text-primary)] prose-headings:font-bold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
          prose-a:text-[var(--cyan)] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[var(--text-primary)]
          prose-code:text-[var(--green)] prose-code:bg-[var(--bg-card)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[var(--bg-card)] prose-pre:border prose-pre:border-[var(--border)] prose-pre:rounded-xl prose-pre:text-sm
          prose-blockquote:border-l-[var(--cyan)] prose-blockquote:text-[var(--text-secondary)]
          prose-hr:border-[var(--border)]
          prose-table:text-sm prose-th:text-[var(--text-primary)] prose-td:text-[var(--text-secondary)]
          prose-li:text-[var(--text-secondary)]">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
