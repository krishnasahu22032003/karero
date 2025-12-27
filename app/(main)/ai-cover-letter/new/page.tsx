import Link from "next/link";
import { ArrowLeft, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      {/* Back Navigation */}
      <div>
        <Link href="/ai-cover-letter">
          <Button
            variant="link"
            className="
              gap-2 pl-0
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
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-md bg-indigo-500/10 flex items-center justify-center shrink-0">
          <FilePlus2 className="h-5 w-5 text-indigo-500" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Create Cover Letter
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Generate a tailored, professional cover letter aligned with your
            experience and the job requirements.
          </p>
        </div>
      </div>

      {/* Generator */}
      <Card
        className="
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-white/10
          transition-shadow
          hover:shadow-xl
        "
      >
        <CardHeader className="p-6">
          <CoverLetterGenerator />
        </CardHeader>
      </Card>
    </div>
  );
}
