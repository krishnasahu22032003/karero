"use client";
import jsPDF from "jspdf";
import { useState, useEffect, useRef } from "react";
import {
  useForm,
  Controller,
  Control,
  FieldPathByValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Download,
  Loader2,
  Save,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Pencil,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { z } from "zod";
import type { ResumeFormValues } from "../../../../types/resume-form.types";

export const resumeSchema = z.object({
  contactInfo: z.object({
    email: z.string().email(),
    mobile: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
  summary: z.string(),
  skills: z.string(),
  experience: z.array(z.any()),
  education: z.array(z.any()),
  projects: z.array(z.any()),
});

export default function ResumeBuilder({ initialContent }: { initialContent?: string }) {
  const { user } = useUser();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const lastSavedContent = useRef(initialContent ?? "");
  const [previewContent, setPreviewContent] = useState(initialContent ?? "");

  useEffect(() => setMounted(true), []);

  const { control, register, handleSubmit, watch } =
    useForm<ResumeFormValues>({
      resolver: zodResolver(resumeSchema),
      defaultValues: {
        contactInfo: {},
        summary: "",
        skills: "",
        experience: [],
        education: [],
        projects: [],
      },
    });

  const { loading: isSaving, fn: saveResumeFn } = useFetch(saveResume);
  const formValues = watch();

  function getContactMarkdown() {
    const parts: string[] = [];
    const c = formValues.contactInfo;

    if (c?.email) parts.push(`Email: ${c.email}`);
    if (c?.mobile) parts.push(`Phone: ${c.mobile}`);
    if (c?.linkedin) parts.push(`[LinkedIn](${c.linkedin})`);
    if (c?.twitter) parts.push(`[Twitter](${c.twitter})`);

    if (!parts.length) return "";

    return `# ${user?.fullName ?? ""}\n${parts.join(" · ")}`;
  }

  function getCombinedContent() {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  useEffect(() => {
    if (isEditing) {
      setPreviewContent(getCombinedContent());
    }
  }, [formValues, isEditing]);

  if (!mounted) return null;

  const onSubmit = async () => {
    toast.loading("Saving resume...", { id: "save" });
    try {
      await saveResumeFn(previewContent.trim());
      lastSavedContent.current = previewContent;
      setIsEditing(false);
      setActiveTab("preview");
      toast.success("Resume saved successfully", { id: "save" });
    } catch {
      toast.error("Failed to save resume", { id: "save" });
    }
  };

  const cancelEdit = () => {
    setPreviewContent(lastSavedContent.current);
    setIsEditing(false);
    setActiveTab("preview");
  };

  const generatePDF = async () => {
    if (isGenerating) return;

    toast.loading("Generating PDF...", { id: "pdf" });
    setIsGenerating(true);

    try {
      const doc = new jsPDF("p", "mm", "a4");

      const marginX = 20;
      const marginY = 20;
      const lineHeight = 7;
      const maxWidth = 170;
      let cursorY = marginY;

      const lines = previewContent.split("\n");

      doc.setFont("Times", "Normal");
      doc.setFontSize(11);

      for (const line of lines) {
        if (cursorY > 280) {
          doc.addPage();
          cursorY = marginY;
        }

        if (line.startsWith("# ")) {
          doc.setFontSize(18);
          doc.setFont("Times", "Bold");
          doc.text(line.replace("# ", ""), marginX, cursorY);
          cursorY += lineHeight + 4;
          doc.setFontSize(11);
          doc.setFont("Times", "Normal");
        } else if (line.startsWith("## ")) {
          doc.setFontSize(14);
          doc.setFont("Times", "Bold");
          doc.text(line.replace("## ", ""), marginX, cursorY);
          cursorY += lineHeight + 2;
          doc.setFontSize(11);
          doc.setFont("Times", "Normal");
        } else if (line.trim() === "") {
          cursorY += lineHeight / 2;
        } else {
          const wrapped = doc.splitTextToSize(line, maxWidth);
          doc.text(wrapped, marginX, cursorY);
          cursorY += wrapped.length * lineHeight;
        }
      }

      doc.save("resume.pdf");
      toast.success("PDF exported successfully", { id: "pdf" });
    } catch {
      toast.error("Failed to export PDF", { id: "pdf" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Resume Builder</h1>

          <div className="flex gap-2">
            {!isEditing && (
              <Button onClick={() => { setIsEditing(true); setActiveTab("edit"); }}>
                <Pencil className="h-4 w-4" /> Edit Resume
              </Button>
            )}

            {isEditing && (
              <>
                <Button onClick={handleSubmit(onSubmit)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />} Save
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </>
            )}

            <Button
              variant="secondary"
              onClick={generatePDF}
              disabled={isGenerating}
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Download />} Export PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="edit">Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <form
              className={`space-y-8 ${
                isEditing ? "" : "pointer-events-none opacity-60"
              }`}
            >
              <Section title="Contact Information">
                <Grid>
                  <InputField icon={Mail} label="Email" {...register("contactInfo.email")} />
                  <InputField icon={Phone} label="Phone" {...register("contactInfo.mobile")} />
                  <InputField icon={Linkedin} label="LinkedIn" {...register("contactInfo.linkedin")} />
                  <InputField icon={Twitter} label="Twitter" {...register("contactInfo.twitter")} />
                </Grid>
              </Section>

              <TextSection title="Professional Summary" name="summary" control={control} />
              <TextSection title="Skills" name="skills" control={control} />
              <EntrySection title="Work Experience" name="experience" control={control} />
              <EntrySection title="Education" name="education" control={control} />
              <EntrySection title="Projects" name="projects" control={control} />
            </form>
          </TabsContent>

          <TabsContent value="preview">
            <MDEditor.Markdown source={previewContent} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

/* helpers unchanged */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function InputField({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon: React.ElementType;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" /> {label}
      </label>
      <Input {...props} />
    </div>
  );
}

function TextSection({
  title,
  name,
  control,
}: {
  title: string;
  name: FieldPathByValue<ResumeFormValues, string>;
  control: Control<ResumeFormValues>;
}) {
  return (
    <Section title={title}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea {...field} value={field.value ?? ""} className="min-h-[140px]" />
        )}
      />
    </Section>
  );
}

function EntrySection({
  title,
  name,
  control,
}: {
  title: "Work Experience" | "Education" | "Projects";
  name: "experience" | "education" | "projects";
  control: Control<ResumeFormValues>;
}) {
  const map = {
    "Work Experience": "Experience",
    Education: "Education",
    Projects: "Project",
  } as const;

  return (
    <Section title={title}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <EntryForm
            type={map[title]}
            entries={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </Section>
  );
}
