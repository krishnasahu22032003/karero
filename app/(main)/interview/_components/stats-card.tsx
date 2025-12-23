import { Brain, Target, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Assessment = {
  quizScore: number;
  questions: Array<unknown>;
  createdAt?: string;
};

type StatsCardsProps = {
  assessments: Assessment[] | null | undefined;
};

export default function StatsCards({ assessments }: StatsCardsProps) {
  const averageScore = (() => {
    if (!assessments?.length) return "0.0";
    const total = assessments.reduce(
      (sum, a) => sum + a.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  })();

  const totalQuestions = (() => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, a) => sum + a.questions.length,
      0
    );
  })();

  const latestScore =
    assessments?.[0]?.quizScore !== undefined
      ? assessments[0].quizScore.toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Average Score */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Score
          </CardTitle>
          <Trophy className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-extrabold tracking-tight">
            {averageScore}%
          </div>
          <p className="text-xs text-muted-foreground">
            Across all assessments
          </p>
        </CardContent>
      </Card>

      {/* Questions Practiced */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Questions Practiced
          </CardTitle>
          <Brain className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-extrabold tracking-tight">
            {totalQuestions}
          </div>
          <p className="text-xs text-muted-foreground">
            Total questions answered
          </p>
        </CardContent>
      </Card>

      {/* Latest Score */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Latest Score
          </CardTitle>
          <Target className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-3xl font-extrabold tracking-tight">
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
