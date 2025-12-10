"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "../lib/prisma"
import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function generateQuiz() {

    const { userId } = await auth()

    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }
    try {
        const prompt = `
Generate exactly 10 high-quality technical interview questions for a ${user.industry} professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
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
            model: "gpt-4.1-mini",
            input: prompt,
        });

        const raw = result.output_text ?? "";
        const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        const quiz = JSON.parse(cleaned)

        return quiz.questions
    } catch (e) {
        console.log((e as Error).message)
        throw new Error("Failed to generate quiz questions ")
    }
}

type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
};


export async function saveQuizResult(questions: QuizQuestion[], answers: Array<string>, score: number) {

    const { userId } = await auth()

    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation,
    }));

    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

    let improvementTip = null;
    if (wrongAnswers.length > 0) {
        const wrongQuestionsText = wrongAnswers
            .map(
                (q) =>
                    `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
            )
            .join("\n\n");

        const improvementPrompt = `
The user answered some ${user.industry} technical interview questions incorrectly.

Here are the questions they got wrong:
${wrongQuestionsText}

Using only the patterns and knowledge gaps suggested by these mistakes, generate a concise improvement tip.

Requirements:
- Focus on the underlying skill or concept the user needs to strengthen.
- Do NOT restate the mistakes, wrong answers, or specific question text.
- Provide clear, encouraging, actionable guidance.
- Keep the entire response to 1–2 sentences.
- Avoid generic advice and tailor the tip to the skill area revealed.
- Return only the improvement tip text—no explanations, no formatting, no JSON.
`;

        try {

            const tipResult = await client.responses.create({
                model: "gpt-4.1-mini",
                input: improvementPrompt,
            })
            improvementTip = tipResult.output_text.trim()

        } catch (e) {
            console.error((e as Error).message)
        }
    }
    try {
        const assessment = await prisma.assessment.create({
            data: {
                userId: user.id,
                quizScore: score,
                questions: questionResults,
                category: "Technical",
                improvementTip,
            },
        });

        return assessment;
    } catch (e) {
        console.error("Error saving quiz result:", (e as Error).message);
        throw new Error("Failed to save quiz result");
    }

}