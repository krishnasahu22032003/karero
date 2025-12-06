"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import { DemandLevel, MarketOutLook } from "@prisma/client";
import { generateAIInsights } from "./dashboard";

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

type Data = {
  industry: string;
  bio?: string;
  experience?: number;
  skills: string[] | undefined;
};

export async function UpdateUser(data: Data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) throw new Error("User Does Not Exists");

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        let industryinsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry }
        });

        if (!industryinsight) {
   
          const aiRaw = await generateAIInsights(data.industry);

          const insights = normalizeInsights(aiRaw);

          industryinsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
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
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryinsight };
      },
      { timeout: 10000 }
    );

    return {
      success: true,
      user: result.updatedUser,
    };
  } catch (e) {
    console.error((e as Error).message);
    throw new Error("Failed to update profile");
  }
}


export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  return {
    isOnboarded: !!user?.industry,
  };
}
