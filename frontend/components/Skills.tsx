"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills, categoryLabels, type Skill } from "@/lib/data/skills";

const CATEGORIES = Object.keys(categoryLabels) as Skill["category"][];

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-mono text-[var(--text-primary)]">{skill.name}</span>
        <span className="text-xs font-mono text-[var(--text-muted)] group-hover:text-[var(--cyan)] transition-colors">
          {skill.level}%
        </span>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--green)]"
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState<Skill["category"]>("languages");

  const filtered = skills.filter((s) => s.category === activeTab);

  return (
    <section id="skills" className="py-24 bg-[var(--bg-secondary)]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">02. skills</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Tech <span className="text-[var(--cyan)]">Stack</span>
          </h2>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 text-xs font-mono rounded border transition-all duration-200 ${
                activeTab === cat
                  ? "border-[var(--cyan)] text-[var(--cyan)] bg-[var(--cyan)]/10"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-bright)]"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Skill bars */}
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
          {filtered.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} />
          ))}
        </div>

        {/* Terminal-style listing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-14 p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl font-mono text-sm overflow-x-auto"
        >
          <p className="text-[var(--green)] mb-3 terminal-prompt">ls skills/</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.name}
                className="px-2 py-0.5 text-xs rounded bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--cyan)] hover:bg-[var(--cyan)]/10 transition-colors cursor-default"
              >
                {s.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
