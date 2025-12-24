"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
  Mail,
  Phone,
  Linkedin,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";
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
  CardDescription,
} from "@/components/ui/card";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

type ResumeBuilderProps = {
  initialContent?: string;
};

export default function ResumeBuilder({
  initialContent,
}: ResumeBuilderProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [resumeMode, setResumeMode] = useState<"edit" | "preview">("preview");
  const [previewContent, setPreviewContent] = useState(initialContent ?? "");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
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

  const { loading: isSaving, fn: saveResumeFn, data, error } =
    useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      setPreviewContent(getCombinedContent() || initialContent || "");
    }
  }, [formValues, activeTab]);

  useEffect(() => {
    if (data && !isSaving) toast.success("Resume saved successfully");
    if (error) toast.error(error.message || "Failed to save resume");
  }, [data, error, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts: string[] = [];

    if (contactInfo?.email) parts.push(`Email: ${contactInfo.email}`);
    if (contactInfo?.mobile) parts.push(`Phone: ${contactInfo.mobile}`);
    if (contactInfo?.linkedin)
      parts.push(`[LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo?.twitter)
      parts.push(`[Twitter](${contactInfo.twitter})`);

    if (!parts.length) return "";

    return `
## <div align="center">${user?.fullName ?? ""}</div>

<div align="center">

${parts.join(" · ")}

</div>
`;
  };

  const getCombinedContent = () => {
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
  };

  const onSubmit = async () => {
    await saveResumeFn(previewContent.trim());
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      await html2pdf()
        .set({
          margin: 15,
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element!)
        .save();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="gradient-title text-4xl md:text-5xl font-bold">
          Resume Builder
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-neutral-200 dark:bg-neutral-800">
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        {/* FORM */}
        <TabsContent value="edit">
          <form className="space-y-8">
            <Section title="Contact Information">
              <Grid>
                <InputField
                  icon={Mail}
                  label="Email"
                  {...register("contactInfo.email")}
                />
                <InputField
                  icon={Phone}
                  label="Phone"
                  {...register("contactInfo.mobile")}
                />
                <InputField
                  icon={Linkedin}
                  label="LinkedIn"
                  {...register("contactInfo.linkedin")}
                />
                <InputField
                  icon={Twitter}
                  label="Twitter"
                  {...register("contactInfo.twitter")}
                />
              </Grid>
            </Section>

            <TextSection
              title="Professional Summary"
              name="summary"
              control={control}
            />
            <TextSection title="Skills" name="skills" control={control} />

            <EntrySection title="Work Experience" name="experience" />
            <EntrySection title="Education" name="education" />
            <EntrySection title="Projects" name="projects" />
          </form>
        </TabsContent>

        {/* PREVIEW */}
        <TabsContent value="preview">
          <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Resume Preview</CardTitle>
              <Button
                variant="ghost"
                onClick={() =>
                  setResumeMode(
                    resumeMode === "preview" ? "edit" : "preview"
                  )
                }
              >
                {resumeMode === "preview" ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Markdown
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent>
              {resumeMode !== "preview" && (
                <div className="flex gap-2 p-3 mb-4 rounded-md border border-amber-500 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Editing markdown will override form changes.
                </div>
              )}

              <MDEditor
                value={previewContent}
                onChange={setPreviewContent}
                height={800}
                preview={resumeMode}
              />
            </CardContent>
          </Card>

          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{ background: "white", color: "black" }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function Section({ title, children }) {
  return (
    <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10">
      <CardHeader>
        <CardTitle className="tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  );
}

function InputField({ label, icon: Icon, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </label>
      <Input {...props} />
    </div>
  );
}

function TextSection({ title, name, control }) {
  return (
    <Section title={title}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            className="min-h-[140px]"
            placeholder={`Enter ${title.toLowerCase()}...`}
          />
        )}
      />
    </Section>
  );
}

function EntrySection({ title, name }) {
  return (
    <Section title={title}>
      <Controller
        name={name}
        control={useForm().control}
        render={({ field }) => (
          <EntryForm
            type={title}
            entries={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </Section>
  );
}
