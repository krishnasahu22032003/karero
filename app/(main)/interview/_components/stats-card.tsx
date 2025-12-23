import { Brain, Target, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Assessment = {
  quizScore: number;
  questions: readonly unknown[];
  createdAt?: string;
};

type StatsCardsProps = {
  assessments?: Assessment[] | null;
};

export default function StatsCards({ assessments }: StatsCardsProps) {
  const hasData = !!assessments?.length;

  const averageScore = hasData
    ? (
        assessments.reduce((sum, a) => sum + a.quizScore, 0) /
        assessments.length
      ).toFixed(1)
    : "0.0";

  const totalQuestions = hasData
    ? assessments.reduce((sum, a) => sum + a.questions.length, 0)
    : 0;

  const latestScore = hasData
    ? [...assessments]
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        )[0]
        .quizScore.toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Average Score */}
      <Card className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Score
          </CardTitle>
          <div className="rounded-full p-2 bg-amber-500/10">
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-4xl font-extrabold tracking-tight">
            {averageScore}%
          </div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      {/* Questions Practiced */}
      <Card className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Questions Practiced
          </CardTitle>
          <div className="rounded-full p-2 bg-indigo-500/10">
            <Brain className="h-4 w-4 text-indigo-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-4xl font-extrabold tracking-tight">
            {totalQuestions}
          </div>
          <p className="text-xs text-muted-foreground">
            Total questions answered
          </p>
        </CardContent>
      </Card>

      {/* Latest Score */}
      <Card className="relative overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Latest Score
          </CardTitle>
          <div className="rounded-full p-2 bg-emerald-500/10">
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-4xl font-extrabold tracking-tight">
            {latestScore}%
          </div>
          <p className="text-xs text-muted-foreground">
            Most recent quiz
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
