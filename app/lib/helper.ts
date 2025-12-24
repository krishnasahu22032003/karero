// app/lib/helper.ts

export type Entry = {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  description: string;
  current?: boolean;
};

export function entriesToMarkdown(
  entries: Entry[] | undefined,
  type: string
): string {
  if (!entries || entries.length === 0) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate ?? ""}`;

        return (
          `### ${entry.title} @ ${entry.organization}\n` +
          `${dateRange}\n\n` +
          `${entry.description}`
        );
      })
      .join("\n\n")
  );
}
