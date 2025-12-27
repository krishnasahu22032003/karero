import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCoverLetterPage({ params }: PageProps) {
  // ✅ REQUIRED: unwrap params Promise
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      {/* Back */}
      <Link href="/ai-cover-letter">
        <Button
          variant="link"
          className="gap-2 pl-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cover Letters
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-indigo-500/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {coverLetter.jobTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {coverLetter.companyName}
          </p>
        </div>
      </div>

      {/* Preview */}
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
        <CoverLetterPreview content={coverLetter.content} />
      </Card>
    </div>
  );
}
