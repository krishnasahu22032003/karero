import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";

export default function MockInterviewPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-14 -mt-14">
      <div className="space-y-10">
        <div className="flex flex-col items-start gap-3">
          <Link href="/interview">
            <Button
              variant="link"
              className="gap-2 px-0 text-sm text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Interview Preparation
            </Button>
          </Link>

          {/* ✅ FULL-WIDTH HEADER (Industry Insights pattern) */}
          <div className="group relative w-full">
            <h1
              className="
                text-4xl md:text-5xl lg:text-6xl
                font-extrabold tracking-tight leading-tight
                bg-clip-text text-transparent
                bg-linear-to-r from-neutral-700 via-neutral-500 to-neutral-300
                dark:from-neutral-200 dark:via-neutral-100 dark:to-white
                drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]
              "
            >
              Mock Interview
            </h1>

            <div
              className="
                h-[3px] w-0
                group-hover:w-full
                mt-2 sm:mt-3
                bg-linear-to-r from-neutral-400 via-neutral-200 to-white
                dark:from-neutral-500 dark:via-neutral-300 dark:to-white
                transition-all duration-700 rounded-full
              "
            />
          </div>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            Test your knowledge with industry-specific interview questions and
            receive structured feedback.
          </p>
        </div>

        
          <Quiz />
      
      </div>
    </div>
  );
}
