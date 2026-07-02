export interface TimelineItem {
  year: string;
  title: string;
  org: string;
  description: string;
  type: "work" | "education";
  tags?: string[];
}

export const timeline: TimelineItem[] = [
  {
    year: "Apr 2024 – Present",
    title: "Freelance Data Science Consultant",
    org: "Contextual AI / IndulgeOut",
    description:
      "Competitive benchmarking of RAG architectures, vector search platforms, and prompt/memory strategies. Built an annotation platform integrating retrieval & generation APIs, improving annotation speed by 50%. Led rapid prototyping of a mobile app including system architecture, APIs, and technical workflows.",
    type: "work",
    tags: ["Python", "FastAPI", "LangChain", "LlamaIndex", "ChromaDB", "Pinecone", "React", "Expo"],
  },
  {
    year: "Nov 2021 – Apr 2024",
    title: "Data Scientist",
    org: "AB InBev",
    description:
      "Designed a Credit Risk ML model that drove a 12.6% uplift in net revenue. Built forecasting models (ARIMA, Prophet, LSTM) improving packaging accuracy by 12%. Built end-to-end Azure Data Factory pipelines, saving 2 hours of planning time per day. Spearheaded a GenAI LangChain POC for the Logistics domain.",
    type: "work",
    tags: ["Python", "LangChain", "Databricks", "Azure", "PySpark", "LSTM", "XGBoost"],
  },
  {
    year: "Oct 2020 – Oct 2021",
    title: "Data Scientist",
    org: "Piramal Glass",
    description:
      "Built a predictive model for daily fuel consumption enabling anomaly detection and saving $500k in fuel costs. Automated financial transaction reconciliation using ML, reducing reconciliation time by 30%.",
    type: "work",
    tags: ["Python", "Random Forest", "PowerBI", "Databricks", "Azure", "PySpark"],
  },
  {
    year: "Jul 2016 – Oct 2020",
    title: "Associate",
    org: "Publicis.Sapient",
    description:
      "Performed market mix modelling to estimate effectiveness of marketing and pricing strategies. Developed a BTYD probabilistic model using customer behavioural characteristics, resulting in a 7% increase in campaign effectiveness.",
    type: "work",
    tags: ["Python", "NLP", "word2vec", "SQL", "Logistic Regression"],
  },
  {
    year: "2022 – 2023",
    title: "M.Sc. Artificial Intelligence & Machine Learning",
    org: "LJMU Liverpool",
    description:
      "Postgraduate degree specialising in AI, machine learning, and deep learning. Built real-world ML systems as part of the programme.",
    type: "education",
    tags: ["AI", "Machine Learning", "Deep Learning"],
  },
  {
    year: "2020 – 2021",
    title: "PG Diploma in Machine Learning & AI",
    org: "IIIT Bangalore",
    description:
      "Intensive programme covering supervised/unsupervised learning, NLP, computer vision, and model deployment.",
    type: "education",
    tags: ["ML", "NLP", "Computer Vision"],
  },
  {
    year: "2012 – 2016",
    title: "B.E. Computer Science",
    org: "University of Pune",
    description:
      "Bachelor of Engineering in Computer Science. Built strong foundations in algorithms, data structures, and software engineering.",
    type: "education",
    tags: ["Computer Science", "Engineering"],
  },
];
