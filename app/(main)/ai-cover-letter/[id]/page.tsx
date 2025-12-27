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
    <div className="container mx-auto max-w-5xl py-8  px-4  sm:space-y-2 md:-mt-14 -mt-24">
      {/* Back */}
      <Link href="/ai-cover-letter">
        <Button
          variant="link"
          className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cover Letters
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
  
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight ">
            {coverLetter.jobTitle}
          </h1>
          <p className="text-md text-muted-foreground">
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
