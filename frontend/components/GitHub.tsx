"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Users, BookOpen, ExternalLink } from "lucide-react";
import { BACKEND_URL } from "@/lib/utils";

interface GitHubStats {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  total_forks: number;
  top_languages: { language: string; count: number }[];
}

interface Contribution {
  date: string;
  count: number;
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#2b7489",
  JavaScript: "#f1e05a",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

function ContributionHeatmap({ contributions }: { contributions: Contribution[] }) {
  if (!contributions.length) {
    return (
      <p className="text-xs font-mono text-[var(--text-muted)] italic">
        Add a GitHub token to display contribution heatmap
      </p>
    );
  }

  const maxCount = Math.max(...contributions.map((c) => c.count), 1);
  const getLevelColor = (count: number) => {
    if (count === 0) return "bg-[var(--border)]";
    const level = Math.ceil((count / maxCount) * 4);
    const colors = ["bg-[var(--green)]/20", "bg-[var(--green)]/40", "bg-[var(--green)]/70", "bg-[var(--green)]"];
    return colors[level - 1];
  };

  // Show last 26 weeks
  const recent = contributions.slice(-182);
  const weeks: Contribution[][] = [];
  for (let i = 0; i < recent.length; i += 7) {
    weeks.push(recent.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => (
            <div
              key={di}
              title={`${day.date}: ${day.count} contributions`}
              className={`w-3 h-3 rounded-sm ${getLevelColor(day.count)} cursor-default transition-opacity hover:opacity-80`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function GitHub() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND_URL}/api/github/stats`).then((r) => r.json()).catch(() => null),
      fetch(`${BACKEND_URL}/api/github/contributions`).then((r) => r.json()).catch(() => ({ contributions: [] })),
    ]).then(([s, c]) => {
      if (s && !s.detail) setStats(s);
      setContributions(c?.contributions ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <section id="github" className="py-24">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">05. github</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Live <span className="text-[var(--cyan)]">GitHub</span> Stats
          </h2>
        </motion.div>

        {loading ? (
          <div className="font-mono text-sm text-[var(--text-muted)] animate-pulse terminal-prompt">
            fetching github data...
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: "Repositories", value: stats.public_repos },
                { icon: Star, label: "Total Stars", value: stats.total_stars },
                { icon: GitFork, label: "Total Forks", value: stats.total_forks },
                { icon: Users, label: "Followers", value: stats.followers },
              ].map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-4 text-center"
                >
                  <Icon size={18} className="text-[var(--cyan)] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[var(--text-primary)] font-mono">{value}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Top languages */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-5"
            >
              <p className="text-sm font-mono text-[var(--text-secondary)] mb-4">Top Languages</p>
              <div className="flex flex-wrap gap-3">
                {stats.top_languages.map(({ language, count }) => (
                  <div key={language} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: LANG_COLORS[language] ?? "#8b949e" }}
                    />
                    <span className="text-sm text-[var(--text-secondary)] font-mono">{language}</span>
                    <span className="text-xs text-[var(--text-muted)]">({count})</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contribution heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-mono text-[var(--text-secondary)]">Contribution Activity</p>
                <a
                  href={`https://github.com/${stats.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-mono text-[var(--cyan)] hover:underline"
                >
                  @{stats.username}
                  <ExternalLink size={11} />
                </a>
              </div>
              <ContributionHeatmap contributions={contributions} />
            </motion.div>
          </div>
        ) : (
          <p className="text-sm font-mono text-[var(--text-muted)]">
            Configure GITHUB_USERNAME in backend .env to show live stats.
          </p>
        )}
      </div>
    </section>
  );
}
