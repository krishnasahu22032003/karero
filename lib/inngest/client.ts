import { Inngest } from "inngest";


export const inngest = new Inngest({  id: "Karero AI",
  name: "Karero AI",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },});