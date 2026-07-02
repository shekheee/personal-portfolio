"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { BACKEND_URL } from "@/lib/utils";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "Request failed");
      }
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="section-container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="section-label mb-3">09. contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            Get In <span className="text-[var(--cyan)]">Touch</span>
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] max-w-md">
            Have a project in mind, a question, or just want to say hi? Drop me a message.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your Name"
                suppressHydrationWarning
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--cyan)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                suppressHydrationWarning
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--cyan)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5">message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell me about your project..."
              suppressHydrationWarning
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--cyan)] transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <p className="text-xs font-mono text-red-400">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="text-xs font-mono text-[var(--green)]">
              ✓ Message sent! I&apos;ll get back to you soon.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--cyan)] text-black font-mono font-bold text-sm rounded hover:bg-[#00b8d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
            {status === "sending" ? "sending..." : "Send Message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
