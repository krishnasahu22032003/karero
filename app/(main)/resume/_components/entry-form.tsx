"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import {
  Sparkles,
  PlusCircle,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { FieldError } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { entrySchema } from "@/app/lib/schema";
import { improveWithAI } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export type Entry = {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
};


type EntryFormProps = {
  type: "Experience" | "Education" | "Project";
  entries: Entry[];
  onChange: (entries: Entry[]) => void;
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDisplayDate(dateString?: string): string {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function EntryForm({ type, entries, onChange }: EntryFormProps) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<Entry>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");
  const description = watch("description");

  /* ---------------- AI Improve ---------------- */

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved");
    }
   if (improveError) {
  toast.error(
    improveError instanceof Error
      ? improveError.message
      : "Failed to improve description"
  );
}
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  /* ---------------- Add Entry ---------------- */

  const handleAdd = handleSubmit((data) => {
    const newEntry: Entry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, newEntry]);
    reset();
    setIsAdding(false);
  });

  const handleDelete = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-4">
      {/* Existing Entries */}
      {entries.map((item, index) => (
        <Card
          key={index}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title} · {item.organization}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(index)}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>

          <CardContent>
            <p className="text-xs text-muted-foreground">
              {item.current
                ? `${item.startDate} – Present`
                : `${item.startDate} – ${item.endDate}`}
            </p>
            <p className="mt-2 text-sm whitespace-pre-wrap">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Add Entry Form */}
      {isAdding && (
        <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Title / Position"
           error={errors.title?.message as string | undefined}
              >
                <Input {...register("title")} />
              </Field>

              <Field
                label="Organization"
                error={errors.organization?.message}
              >
                <Input {...register("organization")} />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Start Date"
                error={errors.startDate?.message}
              >
                <Input type="month" {...register("startDate")} />
              </Field>

              <Field
                label="End Date"
                error={errors.endDate?.message}
              >
                <Input
                  type="month"
                  disabled={current}
                  {...register("endDate")}
                />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) setValue("endDate", "");
                }}
              />
              Currently working here
            </label>

            <Field
              label="Description"
              error={errors.description?.message}
            >
              <Textarea
                className="min-h-[120px]"
                {...register("description")}
              />
            </Field>

            <Button
              type="button"
              variant="ghost"
              className="cursor-pointer"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !description}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} className="cursor-pointer">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          variant="outline"
          className="w-full cursor-pointer" 
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small Helper UI                                                     */
/* ------------------------------------------------------------------ */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
