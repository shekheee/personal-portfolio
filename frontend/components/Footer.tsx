"use client";

import { useEffect, useState } from "react";
import { Mail, Eye } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/GithubIcon";
import { BACKEND_URL } from "@/lib/utils";

export default function Footer() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    // Increment on mount, then display new count
    fetch(`${BACKEND_URL}/api/visits`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => setVisitCount(data.count))
      .catch(() => null);
  }, []);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] py-10">
      <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Branding */}
        <div>
          <p className="font-mono text-[var(--cyan)] font-bold mb-1">&gt;_ portfolio</p>
          <p className="text-xs text-[var(--text-muted)]">
            Built with Next.js + FastAPI · Deployed with Docker
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
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
              className="text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Visitor counter */}
        {visitCount !== null && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
            <Eye size={13} />
            {visitCount.toLocaleString()} visits
          </div>
        )}
      </div>
    </footer>
  );
}
