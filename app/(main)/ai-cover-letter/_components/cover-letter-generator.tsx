"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";

type CoverLetterFormData = z.infer<typeof coverLetterSchema>;

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CoverLetterFormData>({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter, reset, router]);

  const onSubmit = async (data: CoverLetterFormData) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to generate cover letter"
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-indigo-500/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            AI Cover Letter Generator
          </h1>
          <p className="text-sm text-muted-foreground">
            Generate a tailored, professional cover letter in seconds
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card
        className="
          bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-white/10
          transition-all duration-300
          hover:shadow-xl
        "
      >
        <CardHeader>
          <CardTitle className="tracking-tight">Job Details</CardTitle>
          <CardDescription>
            Provide information about the role you’re applying for
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Top Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Google"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-xs text-rose-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Frontend Engineer"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-xs text-rose-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here..."
                className="h-36 resize-none"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-xs text-rose-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            {/* Action */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={generating}
                className="min-w-[180px]"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
