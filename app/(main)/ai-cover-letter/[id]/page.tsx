import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditCoverLetterPage({ params }: PageProps) {
  const { id } = params;

  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) {
    return (
      <div className="container mx-auto py-10">
        <Card
          className="
            bg-white dark:bg-neutral-900
            border border-neutral-200 dark:border-white/10
          "
        >
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Cover letter not found
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      {/* Top Navigation */}
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
      <div className="flex flex-col gap-3">
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
      </div>

      {/* Preview Section */}
      <Card
        className="
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-white/10
          transition-shadow
          hover:shadow-xl
        "
      >
        <CoverLetterPreview content={coverLetter.content} />
      </Card>
    </div>
  );
}
