"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { DemandLevel, MarketOutLook } from "@prisma/client";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function normalizeInsights(ai: any) {
  const demand = (ai.DemandLevel || ai.demandLevel || "").toUpperCase();
  const outlook = (ai.marketOutlook || "").toUpperCase();

  return {
    salaryRanges: ai.salaryRanges ?? [],
    growthRate: Number(ai.growthRate ?? 0),

    demandLevel:
      demand === "HIGH"
        ? DemandLevel.HIGH
        : demand === "MEDIUM"
        ? DemandLevel.MEDIUM
        : demand === "LOW"
        ? DemandLevel.LOW
        : DemandLevel.MEDIUM,

    marketOutlook:
      outlook === "POSITIVE"
        ? MarketOutLook.POSITIVE
        : outlook === "NEGATIVE"
        ? MarketOutLook.NEGATIVE
        : MarketOutLook.NEUTRAL,

    topSkills: ai.topSkills ?? [],
    keyTrends: ai.keyTrends ?? [],
    recommendedSkills: ai.recommendedSkills ?? [],
  };
}

export const generateAIInsights = async (industry: string | null) => {
  if (!industry) throw new Error("Industry is required");

  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights ONLY in this JSON structure:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "DemandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }

    RULES:
    - Output MUST be valid JSON ONLY.
    - No markdown or explanations.
    - At least 5 roles, 5 skills, 5 trends.
  `;

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const raw = result.text ?? "";
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return normalizeInsights(parsed); 
};

export async function Dashboard() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User does not exist");

  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const saved = await prisma.industryInsight.create({
      data: {
        industry: user.industry!,
        salaryRanges: insights.salaryRanges,
        growthRate: insights.growthRate,
        demandLevel: insights.demandLevel,
        topSkills: insights.topSkills,
    marketOutlook: insights.marketOutlook,
        keyTrends: insights.keyTrends,
        recommendedSkills: insights.recommendedSkills,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return saved;
  }

  return user.industryInsight;
}
