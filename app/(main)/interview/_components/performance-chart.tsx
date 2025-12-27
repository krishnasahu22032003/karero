"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

type Assessment = {
  quizScore?: number | string; // ← optional on purpose
  createdAt: string;
};

type ChartPoint = {
  date: string;
  score: number;
  scoreArea: number;
};

type PerformanceChartProps = {
  assessments?: Assessment[] | null;
};

export default function PerformanceChart({
  assessments,
}: PerformanceChartProps) {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

useEffect(() => {
  if (!assessments || assessments.length === 0) {
    setChartData([]);
    return;
  }

  const formatted: ChartPoint[] = assessments
    .filter(a => a.quizScore != null)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )
    .map((a) => {
      const rawScore =
        typeof a.quizScore === "string"
          ? a.quizScore.replace(/[^\d.]/g, "")
          : a.quizScore;

      const numericScore = Number(rawScore);
      const safeScore = Number.isFinite(numericScore) ? numericScore : 0;

      return {
        date: format(new Date(a.createdAt), "MMM dd"),
        score: safeScore,
        scoreArea: safeScore,
      };
    });

  setChartData(formatted);
}, [assessments]);




  const isSinglePoint = chartData.length === 1;

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 hover:shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight">
          Performance Trend
        </CardTitle>
        <CardDescription>
          Your quiz scores over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[260px] sm:h-80">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a3a3a3" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a3a3a3" stopOpacity={0.06} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#d4d4d4"
                  className="dark:stroke-neutral-700"
                />

                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0].payload as ChartPoint;

                    return (
                      <div className="rounded-md bg-neutral-200 dark:bg-neutral-800 border px-3 py-2 text-sm shadow-md">
                        <p className="font-medium">{point.score}%</p>
                        <p className="text-xs text-muted-foreground">
                          {point.date}
                        </p>
                      </div>
                    );
                  }}
                />

                <Area
                  dataKey="scoreArea"
                  fill="url(#scoreFill)"
                  stroke="none"
                />

                <Line
                  dataKey="score"
                  stroke="#404040"
                  strokeWidth={3}
                  dot={{ r: isSinglePoint ? 6 : 4 }}
                  activeDot={{ r: 7 }}
                  className="dark:stroke-neutral-300"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No performance data yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
