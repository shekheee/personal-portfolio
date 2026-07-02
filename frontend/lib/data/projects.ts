export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "rag-annotation-platform",
    title: "RAG Annotation Platform",
    description:
      "Built an annotation platform integrating response generation and retrieval APIs for enterprise RAG evaluation. Improved annotation speed by 50% and provided a scalable workflow for model evaluation across LLM providers.",
    tags: ["Python", "FastAPI", "LangChain", "ChromaDB", "Pinecone", "OpenAI", "Anthropic"],
    github: "https://github.com/shekheee/rag-annotation-platform",
    featured: true,
  },
  {
    id: "credit-risk-ml",
    title: "Credit Risk ML Model",
    description:
      "Designed and deployed a Credit Risk ML model at AB InBev to segment customers into risk categories and determine optimal credit limits and payment terms. Drove a 12.6% uplift in net revenue between control and test groups.",
    tags: ["Python", "scikit-learn", "XGBoost", "Databricks", "Azure", "PySpark"],
    github: "https://github.com/shekheee/credit-risk-ml",
    featured: true,
  },
  {
    id: "genai-logistics-poc",
    title: "GenAI Logistics Assistant",
    description:
      "Spearheaded a Generative AI POC using LangChain for the Logistics domain at AB InBev. Capable of ingesting data from multiple sources and generating personalised responses to support daily planning.",
    tags: ["Python", "LangChain", "OpenAI", "Azure", "Databricks"],
    github: "https://github.com/shekheee/genai-logistics",
    featured: true,
  },
  {
    id: "fuel-consumption-predictor",
    title: "Fuel Consumption Predictor",
    description:
      "Built a predictive model for daily industrial fuel consumption at Piramal Glass, enabling efficient anomaly detection and saving the company $500k in fuel costs. Automated transaction reconciliation reducing reconciliation time by 30%.",
    tags: ["Python", "Random Forest", "PowerBI", "Databricks", "Azure", "PySpark"],
    github: "https://github.com/shekheee/fuel-predictor",
    featured: false,
  },
  {
    id: "packaging-forecast",
    title: "Returnable Packaging Forecasting",
    description:
      "Implemented time-series forecasting models (ARIMA, Prophet, LSTM) at AB InBev to predict returnable packaging demand, improving data forecast accuracy by 12% and reducing production loss.",
    tags: ["Python", "ARIMA", "Prophet", "LSTM", "Azure", "PySpark"],
    github: "https://github.com/shekheee/packaging-forecast",
    featured: false,
  },
  {
    id: "portfolio",
    title: "AI Portfolio Website",
    description:
      "This website — a dark hacker-aesthetic portfolio with a RAG chatbot powered by resume PDF, live GitHub stats, animated timeline, MDX blog, and a hidden CLI easter egg. Built with Next.js + FastAPI.",
    tags: ["Next.js", "TypeScript", "FastAPI", "LangChain", "ChromaDB", "Docker"],
    github: "https://github.com/shekheee/portfolio",
    featured: false,
  },
];
