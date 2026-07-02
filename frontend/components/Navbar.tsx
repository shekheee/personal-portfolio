"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", label: "about" },
  { href: "#skills", label: "skills" },
  { href: "#timeline", label: "timeline" },
  { href: "#projects", label: "projects" },
  { href: "#github", label: "github" },
  { href: "#blog", label: "blog" },
  { href: "#contact", label: "contact" },
];

interface NavbarProps {
  onTerminalOpen: () => void;
  logoClickCount: number;
  onLogoClick: () => void;
}

export default function Navbar({ onTerminalOpen, logoClickCount, onLogoClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        onTerminalOpen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onTerminalOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f2937]"
          : "bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="font-mono text-lg font-bold text-[var(--cyan)] glow-cyan select-none cursor-pointer hover:opacity-80 transition-opacity"
          title={logoClickCount > 0 ? `${3 - logoClickCount} more clicks…` : "Click 3x for a surprise"}
        >
          &gt;_ portfolio
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 text-sm font-mono rounded transition-colors duration-150 ${
                active === href.slice(1)
                  ? "text-[var(--cyan)] bg-[var(--cyan)]/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={onTerminalOpen}
            title="Open terminal (Ctrl+`)"
            className="ml-3 p-2 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--green)] hover:border-[var(--green)] transition-colors"
          >
            <Terminal size={16} />
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#0a0a0a]/95 border-b border-[#1f2937]"
          >
            <div className="section-container py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--cyan)] transition-colors"
                >
                  {`> ${label}`}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onTerminalOpen(); }}
                className="mt-2 px-3 py-2 text-sm font-mono text-[var(--green)] text-left"
              >
                &gt; open terminal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
