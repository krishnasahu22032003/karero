import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-md bg-indigo-500/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-indigo-500" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              My Cover Letters
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage, view, and edit your generated cover letters
            </p>
          </div>
        </div>

        <Link href="/ai-cover-letter/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      {/* List */}
      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
