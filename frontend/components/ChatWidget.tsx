"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BACKEND_URL } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hey! I'm an AI assistant trained on this portfolio. Ask me anything — about skills, projects, experience, or anything else you'd like to know.",
};

function MessageBody({ msg }: { msg: Message }) {
  const content = msg.content ?? "";

  if (msg.streaming && !content) {
    return <span className="cursor-blink" />;
  }

  if (msg.role === "assistant" && content) {
    return (
      <>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="mb-0.5">{children}</li>,
            strong: ({ children }) => <strong className="text-[var(--text-primary)] font-semibold">{children}</strong>,
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--cyan)] underline">
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {msg.streaming ? <span className="cursor-blink" /> : null}
      </>
    );
  }

  return (
    <>
      {content}
      {msg.streaming && content ? <span className="cursor-blink" /> : null}
    </>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingContentRef = useRef<string | null>(null);
  const flushTimerRef = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
      }
    };
  }, []);

  const flushAssistantContent = useCallback((assistantId: string, content: string) => {
    setMessages((prev) =>
      (prev ?? []).map((m) => (m.id === assistantId ? { ...m, content } : m))
    );
  }, []);

  const queueAssistantContent = useCallback(
    (assistantId: string, content: string) => {
      pendingContentRef.current = content;
      if (flushTimerRef.current !== null) return;

      flushTimerRef.current = window.setTimeout(() => {
        flushTimerRef.current = null;
        const next = pendingContentRef.current;
        if (next !== null) flushAssistantContent(assistantId, next);
      }, 50);
    },
    [flushAssistantContent]
  );

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...(prev ?? []), userMsg]);
    setInput("");
    setStreaming(true);

    const assistantId = crypto.randomUUID();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };
    setMessages((prev) => [...(prev ?? []), assistantMsg]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data) as { content?: unknown; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.content != null && parsed.content !== "") {
              accumulated += String(parsed.content);
              queueAssistantContent(assistantId, accumulated);
            }
          } catch (err) {
            if (err instanceof SyntaxError) continue;
            throw err;
          }
        }
      }

      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      flushAssistantContent(assistantId, accumulated);

      setMessages((prev) =>
        (prev ?? []).map((m) => (m.id === assistantId ? { ...m, streaming: false } : m))
      );
    } catch {
      if (flushTimerRef.current !== null) {
        window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      setMessages((prev) =>
        (prev ?? []).map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I ran into an issue. Please try again.", streaming: false }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, sessionId, queueAssistantContent, flushAssistantContent]);

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--cyan)] text-black shadow-lg shadow-[var(--cyan)]/30 flex items-center justify-center"
        aria-label="Toggle chatbot"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? "close" : "open"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] flex flex-col bg-[#0f1117] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-card)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 flex items-center justify-center">
                  <Bot size={14} className="text-[var(--cyan)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Portfolio AI</p>
                  <p className="text-[10px] font-mono text-[var(--green)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] inline-block animate-pulse" />
                    online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Minimize2 size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {(messages ?? []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "assistant"
                        ? "bg-[var(--cyan)]/10 text-[var(--cyan)]"
                        : "bg-[var(--green)]/10 text-[var(--green)]"
                    }`}
                  >
                    {msg.role === "assistant" ? <Bot size={13} /> : <User size={13} />}
                  </div>
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--cyan)] text-black rounded-tr-none"
                        : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] rounded-tl-none"
                    }`}
                  >
                    <MessageBody msg={msg} />
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 focus-within:border-[var(--cyan)] transition-colors">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask me anything..."
                  disabled={streaming}
                  className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || streaming}
                  className="text-[var(--cyan)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
