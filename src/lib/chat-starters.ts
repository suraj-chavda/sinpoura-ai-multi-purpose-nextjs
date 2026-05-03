export type ChatStarter = {
  label: string;
  query: string;
};

export const CHAT_STARTER_PROMPTS: ChatStarter[] = [
  { label: "Summarize my notes", query: "Summarize the following notes into bullet points with clear headings:\n\n" },
  { label: "Debug this idea", query: "Critically review this idea: strengths, risks, and concrete next steps.\n\nIdea:\n" },
  { label: "Explain simply", query: "Explain how embeddings work in large language models to a junior engineer." },
  { label: "Draft an email", query: "Draft a concise professional email asking for a 30-minute sync next week." },
  { label: "Study plan", query: "Create a 7-day study plan for learning Next.js App Router with checkpoints." },
  { label: "Code sketch", query: "Write a minimal TypeScript function that validates email using regex + readable errors." },
];
