"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { timeline } from "@/lib/data/timeline";

export default function Timeline() {
  return (
    <section id="timeline" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">03. timeline</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            My <span className="text-[var(--cyan)]">Journey</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border)] md:-translate-x-px" />

          <div className="space-y-10">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`relative flex items-start gap-6 pl-14 md:pl-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot on line */}
                  <div
                    className={`absolute left-3.5 md:left-1/2 top-3 w-3 h-3 rounded-full border-2 md:-translate-x-1.5 z-10 ${
                      item.type === "work"
                        ? "bg-[var(--cyan)] border-[var(--cyan)]"
                        : "bg-[var(--green)] border-[var(--green)]"
                    }`}
                  />

                  {/* Content card */}
                  <div
                    className={`card p-5 flex-1 md:max-w-[46%] ${
                      isLeft ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`p-1.5 rounded shrink-0 ${
                          item.type === "work"
                            ? "bg-[var(--cyan)]/10 text-[var(--cyan)]"
                            : "bg-[var(--green)]/10 text-[var(--green)]"
                        }`}
                      >
                        {item.type === "work" ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                      </div>
                      <div>
                        <p className="font-mono text-xs text-[var(--text-muted)] mb-0.5">{item.year}</p>
                        <h3 className="font-bold text-[var(--text-primary)] leading-snug">{item.title}</h3>
                        <p className="text-sm text-[var(--cyan)]">{item.org}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                      {item.description}
                    </p>
                    {item.tags && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs font-mono bg-[var(--border)] text-[var(--text-muted)] rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
