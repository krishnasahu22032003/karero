"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import QuizResult from "./quiz-result";
import type { QuestionResult } from "./quiz-result";

type Assessment = {
  id: string;
  quizScore: number;
  createdAt: string;
  improvementTip?: string | null;
  questions: QuestionResult[];
};

type QuizListProps = {
  assessments: Assessment[] | null | undefined;
};

export default function QuizList({ assessments }: QuizListProps) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);

  return (
    <>
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="gradient-title text-2xl md:text-3xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>

            <Button
              onClick={() => router.push("/interview/mock")}
              className="w-full sm:w-auto"
            >
              Start New Quiz
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!assessments?.length ? (
            <p className="text-sm text-muted-foreground">
              No quizzes taken yet.
            </p>
          ) : (
            <div className="space-y-3">
              {assessments.map((assessment, i) => (
                <Card
                  key={assessment.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedQuiz(assessment)}
                  className="
                    cursor-pointer
                    bg-white dark:bg-neutral-900
                    border border-neutral-200 dark:border-white/10
                    transition-all
                    hover:bg-neutral-50 dark:hover:bg-neutral-800
                  "
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="gradient-title text-lg md:text-xl">
                      Quiz {i + 1}
                    </CardTitle>

                    <CardDescription className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs">
                      <span>
                        Score: {assessment.quizScore.toFixed(1)}%
                      </span>
                      <span>
                        {format(
                          new Date(assessment.createdAt),
                          "MMM dd, yyyy · HH:mm"
                        )}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  {assessment.improvementTip && (
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {assessment.improvementTip}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Result Dialog */}
      <Dialog
        open={!!selectedQuiz}
        onOpenChange={() => setSelectedQuiz(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader />
        {selectedQuiz && (
  <QuizResult
    result={{
      quizScore: selectedQuiz.quizScore,
      improvementTip: selectedQuiz.improvementTip ?? null,
      questions: selectedQuiz.questions,
    }}
    hideStartNew
    onStartNew={() => router.push("/interview/mock")}
  />
)}

        </DialogContent>
      </Dialog>
    </>
  );
}
