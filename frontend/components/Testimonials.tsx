"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[var(--bg-secondary)]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">07. testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            What People <span className="text-[var(--cyan)]">Say</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="card p-6 flex flex-col gap-4"
            >
              <Quote size={20} className="text-[var(--cyan)] opacity-50 shrink-0" />
              <p className="text-[var(--text-secondary)] leading-relaxed text-sm italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-[var(--border)] pt-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--cyan)]/30 to-[var(--green)]/20 flex items-center justify-center shrink-0 font-mono text-xs text-[var(--cyan)] font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
