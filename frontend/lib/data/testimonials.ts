export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "Tech Company Inc.",
    quote:
      "One of the most technically sharp engineers I've worked with. Their ability to break down complex AI systems into clean, maintainable code is remarkable. The RAG platform they built became our core infrastructure.",
  },
  {
    id: "2",
    name: "James Okafor",
    role: "CTO",
    company: "Startup Co.",
    quote:
      "They single-handedly modernised our entire frontend. Brought TypeScript best practices, improved our CI/CD, and mentored junior engineers — all while shipping features at an incredible pace.",
  },
  {
    id: "3",
    name: "Dr. Priya Nair",
    role: "Research Lead",
    company: "University of Technology",
    quote:
      "A brilliant student whose thesis work on approximate nearest neighbour search produced genuine novel insights. They have a rare combination of theoretical depth and engineering pragmatism.",
  },
];
