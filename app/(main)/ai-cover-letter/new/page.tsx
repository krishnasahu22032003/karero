import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8  sm:space-y-2 md:-mt-14 -mt-24">
      {/* Back Navigation */}
      <div>
        <Link href="/ai-cover-letter">
          <Button
            variant="link"
            className="
              gap-2 px-0
              text-muted-foreground
              hover:text-foreground
            "
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3">
        <h1
          className="
            text-3xl sm:text-5xl md:text-5xl
            font-extrabold tracking-tight
            bg-clip-text text-transparent
            bg-linear-to-r from-neutral-700 via-neutral-500 to-neutral-400
            dark:from-neutral-200 dark:via-neutral-100 dark:to-white
            drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]
            leading-tight
          "
        >
          Create Cover Letter
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Generate a tailored, professional cover letter aligned with your
          experience and the job requirements.
        </p>
      </div>

      {/* Generator (no outer card) */}
      <div
        className="
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-white/10
          rounded-xl
          p-6 sm:p-8
          transition-shadow
          hover:shadow-xl
        "
      >
        <CoverLetterGenerator />
      </div>
    </div>
  );
}
