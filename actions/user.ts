'use server'
import { auth } from "@clerk/nextjs/server"
import { prisma } from "../lib/prisma"

type Data = {
    industry: string,
    bio?: string,
    experience?: number,
    skills: Array<string>
}

export async function UpdateUser({ data }: {
    data: Data
}) {

    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) {
        throw new Error("User Does Not Exists")
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            let industryinsight = await tx.industryInsight.findUnique({
                where: {
                    industry: data.industry
                }
            });
            if (!industryinsight) {
                industryinsight = await tx.industryInsight.create({
                    data: {
                        industry: data.industry,
                        salaryRanges: [],
                        growthRate: 0,
                        demandLevel: "MEDIUM",
                        topSkills: [],
                        marketOutlook: "NEUTRAL",
                        keyTrends: [],
                        recommendedSkills: [],
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                    }
                });

            };
            const upadtedUser = await tx.user.update({
                where: {
                    id: user.id
                },
                data: {
                    industry: data.industry,
                    experience: data.experience,
                    bio: data.bio,
                    skills: data.skills
                }
            })
            return { upadtedUser, industryinsight }
        }, {
            timeout: 10000
        })
        return result.upadtedUser
    } catch (e) {
        console.error((e as Error).message)
        throw new Error("Failed to updata profile ")
    }
}

export async function getUserOnboardingStatus() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if (!user) {
        throw new Error("User Does Not Exists")
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                industry: true,
            },
        });

        return {
            isOnboarded: !!user?.industry,
        };
    } catch (error) {
        console.error("Error checking onboarding status:", error);
        throw new Error("Failed to check onboarding status");
    }
}
