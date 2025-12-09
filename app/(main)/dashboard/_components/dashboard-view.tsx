"use client";

import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Download,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DemandLevel = "low" | "medium" | "high";

type MarketOutLook = "positive" | "neutral" | "negative";

type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
};

type Insights = {
  industry: string;
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevel: DemandLevel;
  topSkills: string[];
  marketOutlook: MarketOutLook;
  keyTrends: string[];
  recommendedSkills: string[];
  lastUpdated: string;
  nextUpdate: string;
};

export default function DashboardView({ insights }: { insights: Insights }) {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level: DemandLevel) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-emerald-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook: MarketOutLook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-emerald-500" };
      case "neutral":
        return { icon: LineChart, color: "text-amber-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  const summary = `
    The ${insights.industry} industry shows a ${insights.growthRate}% growth rate, 
    ${insights.demandLevel} demand level, and a ${insights.marketOutlook} market outlook. 
    Key skills include ${insights.topSkills.slice(0, 3).join(", ")}.
  `;

  const exportCSV = () => {
    const rows = [
      ["Role", "Min (K)", "Median (K)", "Max (K)"],
      ...salaryData.map((r) => [r.name, r.min, r.median, r.max]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${insights.industry}-salary-data.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-900/50 border-neutral-300 dark:border-white/10"
        >
          Last updated: {lastUpdatedDate}
        </Badge>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed -mt-6">
            {summary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card
          className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize tracking-tight">
              {insights.marketOutlook}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress
              value={insights.growthRate}
              className="mt-2 h-2 rounded-full bg-neutral-200 dark:bg-neutral-800"
            />
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {insights.demandLevel}
            </div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card
          className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-2 py-1 text-xs bg-neutral-200 dark:bg-neutral-800"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card
        className="col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-300 hover:shadow-xl"
      >
        <CardHeader>
          <CardTitle className="font-semibold tracking-tight">
            Salary Ranges by Role
          </CardTitle>
          <CardDescription className="text-sm">
            Displaying minimum, median, and maximum salaries (K)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 rounded-lg p-2 shadow-lg">
                          <p className="font-medium mb-1">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="min" fill="#a3bffa" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#7f9cf5" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#667eea" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <CardHeader>
            <CardTitle className="tracking-tight">
              Key Industry Trends
            </CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500" />
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <CardHeader>
            <CardTitle className="tracking-tight">Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="px-2 py-1 text-xs border-neutral-300 dark:border-white/20"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
