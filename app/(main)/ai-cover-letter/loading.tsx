import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl py-16 md:-mt-14  -mt-14">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="
            h-11 w-11 rounded-md
            bg-neutral-200 dark:bg-neutral-800
            flex items-center justify-center
          "
        >
     <Loader2
  className="
    h-5 w-5 animate-spin
    text-neutral-500
    dark:text-neutral-400
  "
/>

        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Preparing cover letter editor…
          </h2>
          <p className="text-sm text-muted-foreground">
            Setting things up for you
          </p>
        </div>
      </div>

      {/* Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-10 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-32 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}
