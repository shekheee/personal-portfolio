"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { projects, type Project } from "@/lib/data/projects";

const ALL_TAGS = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card p-5 flex flex-col gap-4 h-full"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {project.featured && (
              <Star size={12} className="text-[var(--cyan)] fill-[var(--cyan)] shrink-0" />
            )}
            <h3 className="font-bold text-[var(--text-primary)] leading-snug">{project.title}</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{project.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs font-mono bg-[var(--cyan)]/5 border border-[var(--cyan)]/20 text-[var(--cyan)] rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-[var(--border)]">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <GithubIcon size={13} />
            source
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-[var(--cyan)] hover:underline"
          >
            <ExternalLink size={13} />
            live demo
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag ? projects.filter((p) => p.tags.includes(activeTag)) : projects;

  return (
    <section id="projects" className="py-24 bg-[var(--bg-secondary)]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">04. projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Things I&apos;ve <span className="text-[var(--cyan)]">Built</span>
          </h2>
        </motion.div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 text-xs font-mono rounded border transition-all shrink-0 ${
              activeTag === null
                ? "border-[var(--cyan)] text-[var(--cyan)] bg-[var(--cyan)]/10"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-bright)]"
            }`}
          >
            all
          </button>
          {ALL_TAGS.slice(0, 12).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-all shrink-0 ${
                activeTag === tag
                  ? "border-[var(--cyan)] text-[var(--cyan)] bg-[var(--cyan)]/10"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-bright)]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
