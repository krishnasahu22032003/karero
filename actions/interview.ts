"use server"

import { auth } from "@clerk/nextjs/server"
import {prisma} from "../lib/prisma"
import OpenAI from "openai"

const client = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
}) 

export default async function generateQuiz(){

const {userId} = await auth()

if(!userId) throw new Error ("Unauthorized");

const user = await prisma.user.findUnique({
    where:{
        clerkUserId:userId
    }
})

if(!user){
    throw new Error ("User not found")
}
try{
const prompt = `
Generate exactly 10 high-quality technical interview questions for a ${user.industry} professional${
  user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
}.

Requirements:
- Each question must be multiple choice.
- Provide exactly 4 options per question.
- Options must be plausible and non-repetitive.
- The correct answer must be one of the 4 options.
- Explanations should be concise and technically accurate (1–2 sentences).
- Avoid overly simple questions unless they are fundamental to the domain.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON.
- Do not include any text before or after the JSON.
- Do not wrap the JSON in backticks.
- Ensure double quotes around all keys and values.

Return the final response in this exact JSON structure:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
`;

  const result = await client.responses.create({
    model:"gpt-4.1-mini",
    input: prompt,
  });

  const raw = result.output_text ?? "" ;
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
  const quiz = JSON.parse(cleaned)
  
 return quiz.questions
}catch(e){
console.log((e as Error).message)
throw new Error ("Failed to generate quiz questions ")
}
}