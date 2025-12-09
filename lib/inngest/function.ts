import { prisma } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai";
import { DemandLevel as PrismaDemand, MarketOutLook as PrismaOutlook } from "@prisma/client";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function normalizeAI(ai: any) {
  const demand = (ai.demandLevel || ai.DemandLevel || "").toUpperCase();
  const outlook = (ai.marketOutlook || "").toUpperCase();

  return {
    salaryRanges: (ai.salaryRanges || []).map((r: any) => ({
      role: r.role,
      min: Number(r.min),
      max: Number(r.max),
      median: Number(r.median),
    })),

    growthRate: Number(ai.growthRate || 0),

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

    topSkills: ai.topSkills || [],
    keyTrends: ai.keyTrends || [],
    recommendedSkills: ai.recommendedSkills || [],
  };
}

export const generateIndustryInsights = inngest.createFunction(
  {  id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, 
  async ({ step }) => {
    const industries = await step.run("Fetch industries", async () => {
      return prisma.industryInsight.findMany({ distinct: ["industry"], select: { industry: true }})

    });

    for (const { industry } of industries) {
      const prompt = `
        Analyze the ${industry} industry & return VALID JSON ONLY:
        {
          "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number }
          ],
          "growthRate": number,
          "demandLevel": "High" | "Medium" | "Low",
          "topSkills": ["skill1", "skill2"],
          "marketOutlook": "Positive" | "Neutral" | "Negative",
          "keyTrends": ["trend1", "trend2"],
          "recommendedSkills": ["skill1", "skill2"]
        }
        No markdown. No comments. JSON only.
      `;

const result = await step.run("AI Generate Insights", async () => {
  const res = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = res.text || "";
  const cleaned = text.replace(/```[\s\S]*?```/g, "").trim();

  return JSON.parse(cleaned);
});


      const normalized = normalizeAI(result);

      await step.run(`Update ${industry} insights`, async () => {
        await prisma.industryInsight.update({
          where: { industry },
          data: {
            salaryRanges: normalized.salaryRanges,
            growthRate: normalized.growthRate,
            demandLevel: normalized.demandLevel,
            topSkills: normalized.topSkills,
            marketOutlook: normalized.marketOutlook,
            keyTrends: normalized.keyTrends,
            recommendedSkills: normalized.recommendedSkills,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 86400000),
          },
        });
      });
    }
  }
);
