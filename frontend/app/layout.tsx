import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ajay Shekhawat | Software Engineer & AI Builder",
  description:
    "Personal portfolio of Ajay Shekhawat — Data Scientist & AI Engineer specialising in machine learning, RAG systems, and LLM-powered applications. Explore projects, skills, and a RAG-powered chatbot.",
  openGraph: {
    title: "Ajay Shekhawat | Software Engineer",
    description: "Portfolio with RAG chatbot, live GitHub stats, and a hidden terminal easter egg.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
