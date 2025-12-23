import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-card";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";
import type { QuestionResult } from "./_components/quiz-result";

type AssessmentUI = {
  id: string;
  quizScore: number;
  createdAt: string;
  improvementTip: string | null;
  questions: QuestionResult[];
};

export default async function InterviewPrepPage() {
  const rawAssessments = await getAssessments();

  const assessments: AssessmentUI[] = rawAssessments.map((a) => ({
    id: a.id,
    quizScore: a.quizScore,
    createdAt: a.createdAt.toISOString(),
    improvementTip: a.improvementTip,
    questions: (a.questions as any[]).map((q) => ({
      question: q.question,
      userAnswer: q.userAnswer,
      answer: q.answer,
      explanation: q.explanation,
      isCorrect: q.isCorrect,
    })),
  }));

  return (
    <div>
      {/* Header (UNCHANGED SIZE) */}
      <div className="flex items-center justify-between mb-5">
        <div className="group relative w-full">
          <h1
            className="
              text-4xl md:text-5xl lg:text-6xl
              font-extrabold tracking-tight leading-tight
              bg-clip-text text-transparent
              bg-linear-to-r from-neutral-700 via-neutral-500 to-neutral-400
              dark:from-neutral-200 dark:via-neutral-100 dark:to-white
              drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]
            "
          >
            Interview Preparation
          </h1>

          {/* FULL-WIDTH HOVER LINE (no size change) */}
          <div
            className="
              h-[3px]
              w-full
              mt-2 sm:mt-3
              scale-x-0 origin-left
              group-hover:scale-x-100
              bg-linear-to-r from-neutral-400 via-neutral-200 to-white
              dark:from-neutral-500 dark:via-neutral-300 dark:to-white
              transition-transform duration-700 ease-out
              rounded-full
            "
          />
        </div>
      </div>

      {/* Content (UNCHANGED) */}
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}
