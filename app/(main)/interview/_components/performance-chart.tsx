"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  quizScore: number;
  createdAt: string;
};

type ChartPoint = {
  date: string;
  score: number;
};

type PerformanceChartProps = {
  assessments: Assessment[] | null | undefined;
};

export default function PerformanceChart({
  assessments,
}: PerformanceChartProps) {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (!assessments?.length) {
      setChartData([]);
      return;
    }

    const formatted = assessments
      .slice()
      .reverse()
      .map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));

    setChartData(formatted);
  }, [assessments]);

  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="gradient-title text-2xl md:text-3xl">
          Performance Trend
        </CardTitle>
        <CardDescription>
          Your quiz scores over time
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.4}
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 shadow-md">
                        <p className="text-sm font-medium">
                          {payload[0].value}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "hsl(var(--background))",
                }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
