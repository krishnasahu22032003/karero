"use server";

import { prisma } from "../lib/prisma";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { revalidatePath } from "next/cache";

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* ---------------------------------- */
/* Save Resume                         */
/* ---------------------------------- */
export async function saveResume(content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await prisma.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

/* ---------------------------------- */
/* Get Resume                         */
/* ---------------------------------- */
export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return prisma.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

/* ---------------------------------- */
/* Improve Resume Content with AI     */
/* ---------------------------------- */
type ImproveWithAIInput = {
  current: string;
  type: string;
};

export async function improveWithAI({
  current,
  type,
}: ImproveWithAIInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");
const prompt = `
You are a senior professional resume writer and ATS optimization expert.

Rewrite the following ${type} for a ${user.industry} professional to be highly impactful, results-driven, and aligned with modern industry standards.

CURRENT CONTENT:
"${current}"

GOALS:
- Use strong, varied action verbs
- Quantify achievements with metrics (%, $, time, scale) wherever realistic
- Emphasize relevant technical and domain-specific skills
- Optimize for ATS by naturally incorporating industry keywords
- Focus on outcomes and impact, not duties or responsibilities
- Improve clarity, confidence, and professionalism
- Eliminate filler words and redundancy

STYLE & FORMAT RULES:
- Output exactly ONE concise paragraph
- Do NOT use bullet points
- Do NOT add headings, explanations, or commentary
- Do NOT repeat the original wording unless necessary
- Use clear, professional language suitable for a top-tier resume

Return ONLY the rewritten paragraph.
`;


  try {
    const result = await ai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // ✅ SAME SAFE PATTERN AS YOUR INDUSTRY CODE
    const raw = result.output_text ?? "";

    const cleaned = raw
      .replace(/```/g, "")
      .trim();

    if (!cleaned) {
      throw new Error("Empty AI response");
    }

    return cleaned;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}
