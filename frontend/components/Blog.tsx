"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Tag, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  return (
    <section id="blog" className="py-24 bg-[var(--bg-secondary)]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">06. blog</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Writing &amp; <span className="text-[var(--cyan)]">Thoughts</span>
          </h2>
        </motion.div>

        <div className="space-y-5">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block card p-5 hover:border-[var(--cyan)] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--cyan)] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="font-mono">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readingTime} min read
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(post.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-[var(--border)] font-mono"
                          >
                            <Tag size={9} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-[var(--text-muted)] group-hover:text-[var(--cyan)] group-hover:translate-x-1 transition-all shrink-0 mt-1"
                  />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
