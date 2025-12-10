import { Inngest } from "inngest";


export const inngest = new Inngest({  id: "Karero AI",
  name: "Karero AI",
  credentials: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },});