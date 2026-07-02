"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Projects from "@/components/Projects";
import GitHub from "@/components/GitHub";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import Terminal from "@/components/Terminal";
import Blog from "@/components/Blog";
import type { BlogPost } from "@/lib/blog";

interface HomeClientProps {
  posts: BlogPost[];
}

export default function HomeClient({ posts }: HomeClientProps) {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const closeTerminal = useCallback(() => {
    setTerminalOpen(false);
    setLogoClickCount(0);
  }, []);

  const handleLogoClick = useCallback(() => {
    setLogoClickCount((n) => {
      const next = n + 1;
      if (next >= 3) {
        setTerminalOpen(true);
        return 0;
      }
      return next;
    });
  }, []);

  return (
    <>
      <Navbar
        onTerminalOpen={openTerminal}
        logoClickCount={logoClickCount}
        onLogoClick={handleLogoClick}
      />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <GitHub />
        <Blog posts={posts} />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <Terminal open={terminalOpen} onClose={closeTerminal} />
    </>
  );
}
