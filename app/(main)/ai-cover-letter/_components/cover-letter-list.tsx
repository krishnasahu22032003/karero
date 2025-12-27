"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

type CoverLetter = {
  id: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string | null;
  createdAt: string | Date;
};

export default function CoverLetterList({
  coverLetters,
}: {
  coverLetters: CoverLetter[];
}) {
  const router = useRouter();

  // ✅ NEW: track which item is being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to delete cover letter"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* Empty State */
  if (!coverLetters?.length) {
    return (
      <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {coverLetters.map((letter) => {
        const isDeleting = deletingId === letter.id;

        return (
          <Card
            key={letter.id}
            className="
              bg-white dark:bg-neutral-900
              border border-neutral-200 dark:border-white/10
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                {/* Title + Meta */}
                <div className="min-w-0 space-y-1">
                  <CardTitle className="tracking-tight text-base sm:text-lg truncate">
                    {letter.jobTitle}{" "}
                    <span className="text-muted-foreground font-normal">
                      at {letter.companyName}
                    </span>
                  </CardTitle>

                  <CardDescription className="text-xs sm:text-sm">
                    Created {format(new Date(letter.createdAt), "PPP")}
                  </CardDescription>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/ai-cover-letter/${letter.id}`)
                    }
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="cursor-pointer">
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader className="space-y-4">
                        <AlertDialogTitle className="text-center sm:text-left">
                          Delete Cover Letter?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-center sm:text-left">
                          This action cannot be undone. This will permanently
                          delete your cover letter for{" "}
                          <strong>
                            {letter.jobTitle} at {letter.companyName}
                          </strong>
                          .
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => handleDelete(letter.id)}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                        >
                          {isDeleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {letter.jobDescription}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
