"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import confetti from "canvas-confetti";

const ASCII_HEADER = `
  █████╗      ██╗ █████╗ ██╗   ██╗    ███████╗██╗  ██╗███████╗██╗  ██╗██╗  ██╗ █████╗ ██╗    ██╗ █████╗ ████████╗
 ██╔══██╗     ██║██╔══██╗╚██╗ ██╔╝    ██╔════╝██║  ██║██╔════╝██║ ██╔╝██║  ██║██╔══██╗██║    ██║██╔══██╗╚══██╔══╝
 ███████║     ██║███████║ ╚████╔╝     ███████╗███████║█████╗  █████╔╝ ███████║███████║██║ █╗ ██║███████║   ██║   
 ██╔══██║██   ██║██╔══██║  ╚██╔╝      ╚════██║██╔══██║██╔══╝  ██╔═██╗ ██╔══██║██╔══██║██║███╗██║██╔══██║   ██║   
 ██║  ██║╚█████╔╝██║  ██║   ██║       ███████║██║  ██║███████╗██║  ██╗██║  ██║██║  ██║╚███╔███╔╝██║  ██║   ██║   
 ╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   
`;

const HELP_TEXT = `Available commands:
  help          Show this help message
  about         About me
  skills        List my tech skills
  projects      View my projects
  github        My GitHub profile
  contact       How to reach me
  cat resume    Display resume summary
  ls            List directory contents
  neofetch      System information
  sudo hire me  Execute hiring sequence
  clear         Clear terminal
  exit          Close terminal`;

const COMMANDS: Record<string, () => string> = {
  help: () => HELP_TEXT,
  about: () =>
    `Ajay Shekhawat — Software Engineer & AI enthusiast.
I build intelligent systems, ship fast products, and sometimes make
computers do things they weren't supposed to. RAG fan.

Currently based in the United Kingdom.
Open to interesting opportunities.`,
  skills: () =>
    `Languages:   Python · SQL · R · PySpark · Excel/VBA
AI / ML:     LangChain · LlamaIndex · scikit-learn · Keras/TensorFlow · NLP
Data:        Pandas · NumPy · Databricks · Tableau · PowerBI
Vector DBs:  ChromaDB · Pinecone · Weaviate
Cloud:       Azure · AWS · Azure Data Factory`,
  projects: () =>
    `Recent Projects:
[1] RAG Annotation Platform    — FastAPI + LangChain + ChromaDB/Pinecone
[2] Credit Risk ML Model       — 12.6% revenue uplift @ AB InBev
[3] GenAI Logistics Assistant  — LangChain POC @ AB InBev
[4] Fuel Consumption Predictor — $500k savings @ Piramal Glass
[5] AI Portfolio Website       — Next.js + FastAPI  ← you are here`,
  github: () => `GitHub:       https://github.com/shekheee
Public repos: 4
This site:    github.com/shekheee/personal-portfolio`,
  contact: () =>
    `Email:    shekhawatajay8@gmail.com
LinkedIn: linkedin.com/in/ajay-shekhawat
GitHub:   github.com/shekheee

Or use the contact form on this page.`,
  "cat resume": () =>
    `=== RESUME.TXT ===
Name:       Ajay Shekhawat
Role:       Data Scientist & AI Engineer
Location:   UK / Remote
Email:      shekhawatajay8@gmail.com

Experience:
  2024–now   Freelance DS Consultant (Contextual AI, IndulgeOut)
  2021–24    Data Scientist @ AB InBev
  2020–21    Data Scientist @ Piramal Glass
  2016–20    Associate @ Publicis.Sapient

Education:
  MSc AI & ML — LJMU Liverpool
  PG Diploma ML & AI — IIIT Bangalore
  B.E. Computer Science — University of Pune

Key Stack: Python · LangChain · LlamaIndex · FastAPI
           ChromaDB · Pinecone · Azure · Databricks
Certs:     Azure DP-100 · AWS SAA · Azure AI Fundamentals`,
  ls: () =>
    `/portfolio
├── about/
├── skills/
├── timeline/
├── projects/
├── github/
├── blog/
├── contact/
└── resume.pdf`,
  neofetch: () =>
    `            ████████
         ████████████████         Name:      Ajay Shekhawat
       ████████████████████       OS:        Human 1.0 (LTS)
      ██████████████████████      Host:      UK / Remote
     ████████████████████████     Kernel:    Neuroscience 3.14
     ████████████████████████     Uptime:    8+ years professional
     ████████████████████████     Packages:  AB InBev, Piramal, Sapient
      ██████████████████████      Shell:     Python 3.x (preferred)
       ████████████████████       Terminal:  This one!
         ████████████████         CPU:       Brain @ ∞ GHz (coffee dependent)
            ████████              Memory:    Unlimited (minus Mondays)
                                  Disk:      /dev/ideas (never full)
                                  GitHub:    github.com/shekheee`,
  clear: () => "",
  exit: () => "__exit__",
};

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

interface Line {
  id: string;
  type: "output" | "input" | "header";
  text: string;
}

export default function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { id: "hdr", type: "header", text: ASCII_HEADER },
    { id: "init", type: "output", text: 'Type "help" to see available commands. Press Ctrl+` or click × to exit.' },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const execCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();

    const inputLine: Line = { id: crypto.randomUUID(), type: "input", text: raw };

    if (!cmd) {
      setLines((prev) => [...prev, inputLine]);
      return;
    }

    const handler = COMMANDS[cmd] ?? (() => `command not found: ${cmd}\nType "help" for available commands.`);
    const output = handler();

    if (output === "__exit__") {
      setLines((prev) => [...prev, inputLine, { id: crypto.randomUUID(), type: "output", text: "Goodbye! 👋" }]);
      setTimeout(onClose, 600);
      return;
    }

    if (cmd === "sudo hire me") {
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ["#00d4ff", "#00ff41", "#ffffff"] });
      setLines((prev) => [
        ...prev,
        inputLine,
        {
          id: crypto.randomUUID(),
          type: "output",
          text: `[sudo] password for this-decision: ***
Verifying credentials...
✓ Candidate is awesome
✓ Skills check passed
✓ Culture fit: excellent
✓ Coffee tolerance: HIGH
✓ 'sudo hire me' executed successfully!

🎉 Congrats! You've triggered the hiring sequence.
   Now close this terminal and use the contact form. 😄`,
        },
      ]);
      return;
    }

    const outputLines: Line[] = [];
    if (cmd !== "clear") {
      outputLines.push(inputLine);
    }
    if (output) {
      outputLines.push({ id: crypto.randomUUID(), type: "output", text: output });
    }

    if (cmd === "clear") {
      setLines([{ id: "hdr", type: "header", text: ASCII_HEADER }]);
    } else {
      setLines((prev) => [...prev, ...outputLines]);
    }
  }, [onClose]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const cmd = currentInput;
      if (cmd.trim()) setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      execCommand(cmd);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setCurrentInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setCurrentInput(next === -1 ? "" : history[next] ?? "");
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col p-4 sm:p-8"
          onClick={(e) => { if (e.target === e.currentTarget) inputRef.current?.focus(); }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all"
              />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs font-mono text-[var(--text-muted)]">
                portfolio — terminal — 80×24
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Terminal body */}
          <div
            className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line) =>
              line.type === "header" ? (
                <pre
                  key={line.id}
                  className="text-[var(--cyan)] text-[9px] sm:text-[11px] leading-tight mb-4 overflow-x-auto"
                >
                  {line.text}
                </pre>
              ) : line.type === "input" ? (
                <div key={line.id} className="flex gap-2 text-[var(--text-primary)] mb-0.5">
                  <span className="text-[var(--green)] shrink-0">❯</span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <pre
                  key={line.id}
                  className="whitespace-pre-wrap text-[var(--text-secondary)] mb-3 pl-4 border-l border-[var(--border)]"
                >
                  {line.text}
                </pre>
              )
            )}

            {/* Active input line */}
            <div className="flex gap-2 items-center text-[var(--text-primary)]">
              <span className="text-[var(--green)] shrink-0">❯</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none caret-[var(--cyan)] text-[var(--text-primary)]"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </div>
            </div>
            <div ref={bottomRef} />
          </div>

          <p className="mt-3 text-[10px] font-mono text-[var(--text-muted)] shrink-0">
            Press Esc or Ctrl+` to exit · Arrow keys for history · Try: help, neofetch, sudo hire me
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
