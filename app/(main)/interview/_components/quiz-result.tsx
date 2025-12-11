"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type QuestionResult = {
  question: string;
  userAnswer: string;
  answer: string;
  explanation: string;
  isCorrect: boolean;
};

export type QuizResultType = {
  quizScore: number;
  improvementTip: string | null;
  questions: QuestionResult[];
};

type QuizResultProps = {
  result: QuizResultType;
  hideStartNew?: boolean;
  onStartNew?: () => void;
};

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}: QuizResultProps) {
  if (!result) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold leading-tight">
          <span
            className="inline-flex items-center justify-center rounded-full p-2 shadow-sm"
            aria-hidden
          >
            <Trophy className="h-6 w-6 text-yellow-500" />
          </span>

          {/* gradient title */}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500">
            Quiz Results
          </span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Review your performance and read quick explanations per question.
        </p>
      </div>

      <CardContent className="space-y-6 p-6 bg-transparent">
        {/* Score Overview */}
        <div className="bg-white/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/6 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="text-center space-y-3">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
              {result.quizScore.toFixed(1)}%
            </h3>

            {/* Progress bar - use theme friendly background */}
            <div className="mt-3">
              <Progress
                value={Math.max(0, Math.min(100, result.quizScore))}
                className="h-3 rounded-full bg-neutral-200 dark:bg-neutral-800"
              />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Overall quiz score — higher is better.
            </p>
          </div>
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="rounded-lg p-4 md:p-5 bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/8 backdrop-blur-sm">
            <p className="font-medium mb-1">Improvement Tip:</p>
            <p className="text-sm text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Question Review</h3>

          <div className="grid gap-4">
            {result.questions.map((q, index) => (
              <article
                key={index}
                className="group border border-neutral-200 dark:border-white/6 rounded-lg p-4 md:p-5 space-y-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-neutral-900"
                aria-labelledby={`q-${index}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p
                    id={`q-${index}`}
                    className="font-medium text-sm md:text-base leading-snug"
                  >
                    {q.question}
                  </p>

                  {/* Status icon */}
                  <div className="flex items-center">
                    {q.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Your answer:</span>{" "}
                    <span className="ml-1">{q.userAnswer}</span>
                  </p>
                  {!q.isCorrect && (
                    <p className="mt-1">
                      <span className="font-medium">Correct answer:</span>{" "}
                      <span className="ml-1">{q.answer}</span>
                    </p>
                  )}
                </div>

                <div className="text-sm p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/6">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p className="text-sm text-muted-foreground">{q.explanation}</p>
                </div>

                {/* subtle footer row for meta / index */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Question {index + 1} of {result.questions.length}</span>
                  <span className="opacity-80">Score: {q.isCorrect ? "✓" : "✕"}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="p-4 md:p-5">
          <Button
            onClick={onStartNew}
            className="w-full h-11 rounded-md transition-transform active:scale-98"
          >
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
