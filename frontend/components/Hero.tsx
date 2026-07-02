"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/GithubIcon";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix rain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコ01アRAGBOT>_{}[]();PYTHON次REACT<>AINODE".split("");
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(10, 10, 10, 0.055)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 5 === 0 ? "#00d4ff" : "#00ff41";
        ctx.globalAlpha = 0.25;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      ctx.globalAlpha = 1;
    }

    const interval = setInterval(draw, 55);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops.fill(1);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Matrix canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
        aria-hidden
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-[#0a0a0a]/60 to-[#0a0a0a] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center section-container">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="section-label mb-4"
        >
          &gt; whoami
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl sm:text-7xl font-bold mb-4 text-[var(--text-primary)] glitch"
          data-text="Ajay Shekhawat"
        >
          Ajay Shekhawat
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl sm:text-2xl font-mono text-[var(--cyan)] mb-8 h-8"
        >
          <TypeAnimation
            sequence={[
              "Data Scientist",
              2000,
              "AI / ML Engineer",
              2000,
              "RAG Architect",
              2000,
              "LLM Systems Builder",
              2000,
              "Freelance AI Consultant",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
          <span className="cursor-blink" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-xl mx-auto text-[var(--text-secondary)] text-base sm:text-lg mb-10 leading-relaxed"
        >
          I build intelligent systems, ship fast products, and sometimes make computers do things
          they weren&apos;t supposed to. RAG fan. Open-source contributor. Perpetually caffeinated.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a
            href="#about"
            className="px-6 py-3 bg-[var(--cyan)] text-black font-mono font-bold rounded text-sm hover:bg-[#00b8d9] transition-colors"
          >
            View Resume
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-[var(--cyan)] text-[var(--cyan)] font-mono rounded text-sm hover:bg-[var(--cyan)]/10 transition-colors"
          >
            Chat with Me
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-5"
        >
          {[
            { href: "https://github.com/shekheee", icon: GithubIcon, label: "GitHub" },
            { href: "https://www.linkedin.com/in/ajay-shekhawat/", icon: LinkedinIcon, label: "LinkedIn" },
            { href: "mailto:shekhawatajay8@gmail.com", icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--text-muted)]"
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
