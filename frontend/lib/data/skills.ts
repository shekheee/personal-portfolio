export interface Skill {
  name: string;
  level: number; // 0-100
  category: "languages" | "frameworks" | "tools" | "cloud";
}

export const skills: Skill[] = [
  // Languages
  { name: "Python", level: 95, category: "languages" },
  { name: "SQL", level: 90, category: "languages" },
  { name: "R", level: 65, category: "languages" },
  { name: "PySpark", level: 72, category: "languages" },
  { name: "Excel / VBA", level: 85, category: "languages" },

  // Frameworks
  { name: "LangChain", level: 90, category: "frameworks" },
  { name: "LlamaIndex", level: 82, category: "frameworks" },
  { name: "FastAPI", level: 88, category: "frameworks" },
  { name: "scikit-learn", level: 92, category: "frameworks" },
  { name: "Pandas / NumPy", level: 95, category: "frameworks" },
  { name: "Keras / TensorFlow", level: 72, category: "frameworks" },
  { name: "React / Next.js", level: 75, category: "frameworks" },

  // Tools
  { name: "ChromaDB", level: 88, category: "tools" },
  { name: "Pinecone", level: 80, category: "tools" },
  { name: "Weaviate", level: 72, category: "tools" },
  { name: "Databricks", level: 80, category: "tools" },
  { name: "Tableau / PowerBI", level: 78, category: "tools" },
  { name: "Docker", level: 80, category: "tools" },
  { name: "MySQL / SQL Server", level: 88, category: "tools" },
  { name: "MongoDB", level: 65, category: "tools" },

  // Cloud
  { name: "Azure", level: 80, category: "cloud" },
  { name: "AWS", level: 72, category: "cloud" },
  { name: "Azure Data Factory", level: 78, category: "cloud" },
];

export const categoryLabels: Record<Skill["category"], string> = {
  languages: "Languages",
  frameworks: "Frameworks & Libraries",
  tools: "Tools & Databases",
  cloud: "Cloud & Infrastructure",
};
