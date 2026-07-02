"use client";

import { motion } from "framer-motion";
import { Download, MapPin, Briefcase } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Avatar side */}
          <div className="flex flex-col items-center md:items-start gap-6">
            {/* Avatar placeholder — replace src with your photo */}
            <div className="relative">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--green)]/10 border border-[var(--cyan)]/30 flex items-center justify-center overflow-hidden">
                <span className="font-mono text-6xl text-[var(--cyan)] opacity-60">AS</span>
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-3 right-3 w-4 h-4 bg-[var(--green)] rounded-full border-2 border-[#0a0a0a] animate-pulse" />
            </div>

            {/* Quick facts */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
                <MapPin size={14} className="text-[var(--cyan)]" />
                San Francisco, CA
              </span>
              <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
                <Briefcase size={14} className="text-[var(--cyan)]" />
                Open to opportunities
              </span>
            </div>

            {/* Download CV */}
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-5 py-2.5 border border-[var(--cyan)] text-[var(--cyan)] font-mono text-sm rounded hover:bg-[var(--cyan)]/10 transition-colors"
            >
              <Download size={15} />
              Download Resume
            </a>
          </div>

          {/* Bio side */}
          <div>
            <p className="section-label mb-3">01. about_me</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6">
              Hey, I&apos;m <span className="text-[var(--cyan)] glow-cyan">Ajay Shekhawat</span>
            </h2>

            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
              <p>
                Results-oriented Data Scientist & AI Engineer with 8+ years of experience tackling
                complex business problems across diverse industries. Expertise in advanced analytics,
                machine learning, statistical modelling, and LLM-powered systems.
              </p>
              <p>
                Currently building RAG architectures and LLM evaluation tools as a freelance consultant,
                working with vector databases like ChromaDB, Pinecone, and Weaviate. Previously drove
                measurable impact at AB InBev (12.6% revenue uplift) and Piramal Glass ($500k cost savings).
              </p>
              <p>
                MSc in AI & ML from LJMU Liverpool. Certified in{" "}
                <span className="text-[var(--cyan)] font-mono">Azure DP-100</span>,{" "}
                <span className="text-[var(--cyan)] font-mono">AWS Solutions Architect</span>, and Google Analytics.
              </p>
            </div>

            {/* Terminal-style stats */}
            <div className="mt-8 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg font-mono text-sm">
              <p className="text-[var(--green)] mb-2">$ cat stats.json</p>
              <div className="text-[var(--text-secondary)] space-y-1">
                <p><span className="text-[var(--cyan)]">"experience"</span>: <span className="text-[#f0883e)]">"8+ years"</span>,</p>
                <p><span className="text-[var(--cyan)]">"companies"</span>: <span className="text-[#79c0ff]">4</span>,</p>
                <p><span className="text-[var(--cyan)]">"certifications"</span>: <span className="text-[#79c0ff]">4</span>,</p>
                <p><span className="text-[var(--cyan)]">"coffee_consumed"</span>: <span className="text-[#f0883e]">"∞"</span></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
