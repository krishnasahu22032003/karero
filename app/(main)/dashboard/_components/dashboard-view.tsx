"use client"

import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format , formatDistanceToNow} from "date-fns";
import { Badge  } from "@/components/ui/badge";
enum DemandLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

enum MarketOutLook {
  POSITIVE = "positive",
  NEUTRAL = "neutral",
  NEGATIVE = "negative",
}

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
  lastUpdated: string,
  nextUpdate: string
};

export default function DashboardView({ insights }:{
    insights : Insights
}) {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level : DemandLevel) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook : MarketOutLook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
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

return(
    <div className="space-y-6">
        <div className="flex items-center justify-between">
      <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
        </div>
    </div>
)

}