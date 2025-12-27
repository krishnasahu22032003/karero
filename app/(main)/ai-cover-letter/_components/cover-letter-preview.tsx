"use client";

import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";

type Props = {
  content: string;
};

export default function CoverLetterPreview({ content }: Props) {
  const { theme } = useTheme();

  return (
    <div
      className="py-4"
      data-color-mode={theme === "dark" ? "dark" : "light"}
    >
      <MDEditor
        value={content}
        preview="preview"
        height={700}
      />
    </div>
  );
}
