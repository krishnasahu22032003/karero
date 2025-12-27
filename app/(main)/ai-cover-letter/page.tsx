import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8 md:-mt-14 -mt-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        
        {/* FULL WIDTH GROUP (important) */}
        <div className="group relative w-full">
          <h1
            className="
              text-3xl sm:text-5xl md:text-5xl
              font-extrabold tracking-tight
              bg-clip-text text-transparent
              bg-linear-to-r from-neutral-700 via-neutral-600 to-neutral-500
              dark:from-neutral-200 dark:via-neutral-200 dark:to-white
              drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]
              leading-tight
            "
          >
            My Cover Letters
          </h1>

          {/* FULL WIDTH UNDERLINE */}
          <div
            className="
              h-[3px] w-full
              mt-2 sm:mt-3
              bg-linear-to-r from-neutral-400 via-neutral-200 to-white
              dark:from-neutral-500 dark:via-neutral-300 dark:to-white
              transition-all duration-700
              rounded-full
              scale-x-0 origin-left
              group-hover:scale-x-100
            "
          />

          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Manage, view, and edit your generated cover letters
          </p>
        </div>

        {/* CTA */}
        <Link href="/ai-cover-letter/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto cursor-pointer">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* List */}
      <CoverLetterList coverLetters={coverLetters} />
    </div>
  );
}
