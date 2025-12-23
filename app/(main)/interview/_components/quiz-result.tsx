"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-1 sm:space-y-2">
        <h1
          className="
            flex items-center gap-2 sm:gap-3
            text-2xl sm:text-4xl
            font-extrabold tracking-tight
            bg-clip-text text-transparent
            bg-linear-to-r from-neutral-700 via-neutral-500 to-neutral-300
            dark:from-neutral-200 dark:via-neutral-100 dark:to-white
          "
        >
          <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 shrink-0" />
          Quiz Results
        </h1>

        <p className="text-sm text-muted-foreground max-w-xl">
          Review your performance and understand each answer clearly.
        </p>
      </div>

      {/* Score Card */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">
            {result.quizScore.toFixed(1)}%
          </div>

          <Progress
            value={Math.max(0, Math.min(100, result.quizScore))}
            className="h-2.5 sm:h-3 rounded-full bg-neutral-200 dark:bg-neutral-800"
          />

          <p className="text-xs text-muted-foreground">
            Overall quiz score
          </p>
        </CardContent>
      </Card>

      {/* Improvement Tip */}
      {result.improvementTip && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
          <CardContent className="p-4 sm:p-5 space-y-1">
            <p className="font-medium text-sm">Improvement Tip</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.improvementTip}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Question Review */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight">
          Question Review
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {result.questions.map((q, index) => (
            <Card
              key={index}
              className="
                bg-white dark:bg-neutral-900
                border border-neutral-200 dark:border-white/10
                transition-all duration-300
                hover:shadow-lg
              "
            >
              <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <p className="font-medium text-sm sm:text-base leading-snug">
                    {q.question}
                  </p>

                  {q.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  )}
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium text-foreground">
                      Your answer:
                    </span>{" "}
                    {q.userAnswer}
                  </p>

                  {!q.isCorrect && (
                    <p>
                      <span className="font-medium text-foreground">
                        Correct answer:
                      </span>{" "}
                      {q.answer}
                    </p>
                  )}
                </div>

                <div className="rounded-lg p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10">
                  <p className="text-sm font-medium mb-1">Explanation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {q.explanation}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>
                    Question {index + 1} of {result.questions.length}
                  </span>
                  <span>{q.isCorrect ? "Correct" : "Incorrect"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      {!hideStartNew && (
        <CardFooter className="px-0 pt-2 sm:pt-4">
          <Button
            onClick={onStartNew}
            className="w-full h-11"
          >
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
