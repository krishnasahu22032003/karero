"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import OpenAi from "openai"
import { DemandLevel as PrismaDemand, MarketOutLook as PrismaOutlook } from "@prisma/client";

const ai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY!,
});

function normalizeInsights(ai: any) {
  const demand = (ai.DemandLevel || ai.demandLevel || "").toUpperCase();
  const outlook = (ai.marketOutlook || "").toUpperCase();

  return {
    salaryRanges: ai.salaryRanges ?? [],
    growthRate: Number(ai.growthRate ?? 0),

    demandLevel:
      demand === "HIGH"
        ? PrismaDemand.HIGH
        : demand === "MEDIUM"
        ? PrismaDemand.MEDIUM
        : PrismaDemand.LOW,

    marketOutlook:
      outlook === "POSITIVE"
        ? PrismaOutlook.POSITIVE
        : outlook === "NEGATIVE"
        ? PrismaOutlook.NEGATIVE
        : PrismaOutlook.NEUTRAL,

    topSkills: ai.topSkills ?? [],
    keyTrends: ai.keyTrends ?? [],
    recommendedSkills: ai.recommendedSkills ?? [],
  };
}

export const generateAIInsights = async (industry: string | null) => {
  if (!industry) throw new Error("Industry is required");

  const prompt = `
    Analyze the ${industry} industry and return JSON ONLY:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number }
      ],
      "growthRate": number,
      "DemandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
  `;

  const result = await ai.responses.create({
    model:"gpt-4.1-mini",
    input: prompt,
  });

  const raw = result.output_text ?? "" ;
  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  return normalizeInsights(JSON.parse(cleaned));
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
    const aiInsights = await generateAIInsights(user.industry);

    const saved = await prisma.industryInsight.create({
      data: {
        industry: user.industry!,
        salaryRanges: aiInsights.salaryRanges,
        growthRate: aiInsights.growthRate,
        demandLevel: aiInsights.demandLevel,
        topSkills: aiInsights.topSkills,
        marketOutlook: aiInsights.marketOutlook,
        keyTrends: aiInsights.keyTrends,
        recommendedSkills: aiInsights.recommendedSkills,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 86400000),
      },
    });

    return {
      id: saved.id,
      industry: saved.industry,
      demandLevel: saved.demandLevel.toLowerCase() as "low" | "medium" | "high",
      marketOutlook: saved.marketOutlook.toLowerCase() as
        | "positive"
        | "neutral"
        | "negative",

      growthRate: saved.growthRate,
      topSkills: saved.topSkills,
      keyTrends: saved.keyTrends,
      recommendedSkills: saved.recommendedSkills,
      salaryRanges: (saved.salaryRanges as any[]).map((r) => ({
        role: r.role,
        min: Number(r.min),
        max: Number(r.max),
        median: Number(r.median),
      })),

      lastUpdated: saved.lastUpdated.toString(),
      nextUpdate: saved.nextUpdate.toString(),
    };
  }

  const saved = user.industryInsight;

  return {
    id: saved.id,
    industry: saved.industry,
    
    demandLevel: saved.demandLevel.toLowerCase() as "low" | "medium" | "high",
    marketOutlook: saved.marketOutlook.toLowerCase() as
      | "positive"
      | "neutral"
      | "negative",

    growthRate: saved.growthRate,
    topSkills: saved.topSkills,
    keyTrends: saved.keyTrends,
    recommendedSkills: saved.recommendedSkills,

    salaryRanges: (saved.salaryRanges as any[]).map((r) => ({
      role: r.role,
      min: Number(r.min),
      max: Number(r.max),
      median: Number(r.median),
    })),

    lastUpdated: saved.lastUpdated.toString(),
    nextUpdate: saved.nextUpdate.toString(),
  };
}
