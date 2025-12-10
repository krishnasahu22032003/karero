"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { UpdateUser } from "@/actions/user";

type Industry = {
  id: string;
  name: string;
  subIndustries: string[];
};

type OnboardingInput = z.input<typeof onboardingSchema>;
type OnboardingOutput = z.infer<typeof onboardingSchema>;

type Props = {
  industries: Industry[];
};

const TiltCard: React.FC<
  React.PropsWithChildren<{ className?: string; disabled?: boolean }>
> = ({ children, className = "", disabled = false }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, s: 1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setT({
      rx: (py - 0.5) * 6,
      ry: (px - 0.5) * 6,
      s: 1,
    });
  };

  const onLeave = () => setT({ rx: 0, ry: 0, s: 1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer backdrop-blur-sm transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
    >

      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-20 transition duration-500"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.14), transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-25 transition duration-500"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 60%, transparent)",
        }}
      />
      <div
        style={{
          transform: `perspective(1100px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,
          transition: "transform 140ms ease-out",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

const AccordionStep: React.FC<
  React.PropsWithChildren<{
    title: string;
    subtitle?: string;
    open: boolean;
    onToggle: () => void;
    stepNumber?: number;
  }>
> = ({ title, subtitle, open, onToggle, children, stepNumber }) => {
  return (
    <div className="md:hidden border border-transparent">
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 bg-transparent"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-semibold tracking-wide text-black dark:text-white">
              {stepNumber ? `Step ${stepNumber}: ` : ""}
              {title}
            </span>
          </div>
          {subtitle && (
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          )}
        </div>

        <div
          className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition ${open ? "bg-linear-to-br from-gray-900 to-neutral-700 text-white" : "bg-transparent"
            }`}
        >
          {open ? <Check className="w-4 h-4" /> : <span className="text-sm opacity-60">+</span>}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden px-4"
      >
        <div className="py-3">{children}</div>
      </motion.div>
      <hr className="mx-4 border-t border-gray-100 dark:border-white/6" />
    </div>
  );
};

const StepIndicator: React.FC<{
  steps: string[];
  current: number;
  onJump?: (index: number) => void;
}> = ({ steps, current, onJump }) => {
  return (
    <div className="hidden md:flex items-center gap-6 mb-6 -mt-12">
      {steps.map((s, i) => {
        const active = i === current;
        return (
          <button
            key={s}
            onClick={() => onJump?.(i)}
            className="group flex flex-col items-start bg-transparent border-none cursor-pointer"
            aria-current={active ? "step" : undefined}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition ${active
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                  : "bg-white/50 dark:bg-transparent text-black/80 dark:text-white/80 border border-gray-200/30"
                }`}
            >
              {i + 1}
            </div>

            <span className="mt-2 text-xs text-muted-foreground group-hover:underline">{s}</span>
            <div
              className={`h-0.5 mt-2 w-0 group-hover:w-full transition-all duration-400 ${active ? "bg-black dark:bg-white" : "bg-transparent"
                }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default function OnboardingWizard({ industries }: Props) {
  const router = useRouterSafe();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);


  const steps = useMemo(
    () => ["Industry", "Experience + Skills", "Bio & Review"],
    []
  );
  const [stepIndex, setStepIndex] = useState(0);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(UpdateUser);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<OnboardingInput, any, OnboardingOutput>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      industry: "",
      subIndustry: "",
      bio: "",
      experience: "0",
      skills: "",
    },
  });

  useEffect(() => {
    const sub = watch((values) => {
      const industryId = values?.industry as string | undefined;
      if (industryId) {
        setSelectedIndustry(industries.find((ind) => ind.id === industryId) ?? null);
      }
    });
    return () => sub.unsubscribe();

  }, [industries, watch]);

  const watchIndustry = watch("industry");
  const watchSubIndustry = watch("subIndustry");

  const goNext = async () => {
    const stepValid = await validateCurrentStep();
    if (!stepValid) return;
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
    setOpenIndex((idx) => (idx === null ? 0 : idx + 1));
  };

  const goPrev = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };

  const jumpTo = (index: number) => {
    setStepIndex(index);
    setOpenIndex(index);
  };

  async function validateCurrentStep() {

    if (stepIndex === 0) {
      const ok = await trigger(["industry", "subIndustry"]);
      if (!ok) toast.error("Please choose an industry and specialization.");
      return ok;
    }
    if (stepIndex === 1) {
      const ok = await trigger(["experience", "skills"]);
      if (!ok) toast.error("Please enter valid experience and at least one skill.");
      return ok;
    }
    if (stepIndex === 2) {
      const ok = await trigger(["bio"]);
      return ok;
    }
    return true;
  }

  const onSubmit: SubmitHandler<OnboardingOutput> = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      const result = await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });

      if (result?.success) {
        toast.success("Profile updated!");
        router.push("/dashboard");
        return;
      }

      toast.error("Something went wrong.");
    } catch (err) {
      console.error("Onboarding submit error", err);
      toast.error("Something went wrong.");
    }
  };



  const toggleOpen = (index: number) => {
    setOpenIndex((cur) => (cur === index ? null : index));
    setStepIndex(index);
  };


  const UnderlinedTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
    <div className="group">
      <h2 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white inline-block relative">
        {title}
        <span
          className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-linear-to-r from-black/40 via-black/20 to-transparent dark:from-white/40"
          style={{ display: "block" }}
        />
      </h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
    </div>
  );
  const parsed = onboardingSchema.safeParse(getValues());
  return (
    <section className="w-full flex items-center justify-center px-4 md:px-8 lg:px-16">
      <div className="w-full max-w-4xl">
        <StepIndicator steps={steps} current={stepIndex} onJump={jumpTo} />

        <TiltCard className="p-1">
          <Card className="rounded-3xl overflow-visible shadow-[0_20px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <CardHeader className="p-6 md:p-8 bg-linear-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-extrabold gradient-title">
                      Complete Your Profile
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-gray-600 dark:text-gray-300/80">
                      Rapid onboarding—share a few details and Karero will craft personalized learning paths and mock interviews.
                    </CardDescription>
                  </div>

                  <div className="hidden md:flex flex-col items-end">
                    <div className="text-xs text-muted-foreground mb-2">Progress</div>
                    <div className="w-48 h-3 rounded-full bg-gray-100 dark:bg-white/6 overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-black to-neutral-700"
                        style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs mt-2 text-right text-muted-foreground">
                      Step {stepIndex + 1} of {steps.length}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 md:p-8">

                <div className="md:hidden">
                  <AccordionStep
                    title="Industry"
                    subtitle="Pick industry & specialization"
                    open={openIndex === 0}
                    onToggle={() => toggleOpen(0)}
                    stepNumber={1}
                  >
                    <div className="space-y-4">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        onValueChange={(value) => {
                          setValue("industry", value);
                          setSelectedIndustry(industries.find((ind) => ind.id === value) ?? null);
                          setValue("subIndustry", "");
                        }}
                      >
                        <SelectTrigger id="industry" className="rounded-2xl ">
                          <SelectValue placeholder="Choose your industry" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="mb-2">Industries</SelectLabel>
                            {industries.map((ind) => (
                              <SelectItem key={ind.id} value={ind.id}>
                                {ind.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.industry && <p className="text-sm text-rose-500">{String(errors.industry.message)}</p>}

                      <Label htmlFor="subIndustry">Specialization</Label>
                      <Select onValueChange={(value) => setValue("subIndustry", value)}>
                        <SelectTrigger id="subIndustry" className="rounded-2xl">
                          <SelectValue placeholder="Choose a specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Specializations</SelectLabel>
                            {selectedIndustry?.subIndustries?.length ? (
                              selectedIndustry.subIndustries.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-3 text-sm text-gray-500">Choose an industry first.</div>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.subIndustry && <p className="text-sm text-rose-500">{String(errors.subIndustry.message)}</p>}
                    </div>
                  </AccordionStep>

                  <AccordionStep
                    title="Experience + Skills"
                    subtitle="Quick: total years + top skills"
                    open={openIndex === 1}
                    onToggle={() => toggleOpen(1)}
                    stepNumber={2}
                  >
                    <div className="space-y-4">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        min={0}
                        max={50}
                        inputMode="numeric"
                        {...register("experience", { required: true })}
                      />
                      {errors.experience && <p className="text-sm text-rose-500">{String(errors.experience.message)}</p>}

                      <Label htmlFor="skills">Skills</Label>
                      <Input id="skills" placeholder="Comma separated — e.g., Python, Product" {...register("skills")} />
                      <p className="text-xs text-muted-foreground">Include tools, languages, and strengths. The AI will parse them.</p>
                      {errors.skills && <p className="text-sm text-rose-500">{String(errors.skills.message)}</p>}
                    </div>
                  </AccordionStep>

                  <AccordionStep
                    title="Bio & Review"
                    subtitle="Short bio + final review"
                    open={openIndex === 2}
                    onToggle={() => toggleOpen(2)}
                    stepNumber={3}
                  >
                    <div className="space-y-4">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea id="bio" className="h-28" placeholder="One-line summary — what drives you" {...register("bio")} />
                      <p className="text-xs text-muted-foreground">We’ll use this to personalise messages and interview prompts.</p>
                      {errors.bio && <p className="text-sm text-rose-500">{String(errors.bio.message)}</p>}

                      <div className="mt-4">
                        <Button
                          type="submit"
                          className="w-full rounded-2xl py-3 flex items-center justify-center gap-2 cursor-pointer"
                          disabled={updateLoading}
                        >
                          {updateLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Complete Profile"
                          )}
                        </Button>
                      </div>
                    </div>
                  </AccordionStep>
                </div>


                <div className="hidden md:block">

                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: stepIndex === 0 ? 1 : 0.3, y: stepIndex === 0 ? 0 : 8 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: stepIndex === 0 ? "block" : "none" }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <UnderlinedTitle title="Industry" subtitle="Select industry and specialization" />
                        <div className="text-xs text-muted-foreground">Step 1</div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Select
                            onValueChange={(value) => {
                              setValue("industry", value);
                              setSelectedIndustry(industries.find((ind) => ind.id === value) ?? null);
                              setValue("subIndustry", "");
                            }}
                          >
                            <SelectTrigger id="industry" className="rounded-2xl">
                              <SelectValue placeholder="Choose your industry" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Industries</SelectLabel>
                                {industries.map((ind) => (
                                  <SelectItem key={ind.id} value={ind.id}>
                                    {ind.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {errors.industry && <p className="text-sm text-rose-500">{String(errors.industry.message)}</p>}
                        </div>

                        <div>
                          <Label htmlFor="subIndustry">Specialization</Label>
                          <Select onValueChange={(value) => setValue("subIndustry", value)}>
                            <SelectTrigger id="subIndustry" className="rounded-2xl">
                              <SelectValue placeholder="Choose a specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Specializations</SelectLabel>
                                {selectedIndustry?.subIndustries?.length ? (
                                  selectedIndustry.subIndustries.map((sub) => (
                                    <SelectItem key={sub} value={sub}>
                                      {sub}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-3 text-sm text-gray-500">Choose an industry first.</div>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          {errors.subIndustry && <p className="text-sm text-rose-500">{String(errors.subIndustry.message)}</p>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: stepIndex === 1 ? 1 : 0.3, y: stepIndex === 1 ? 0 : 8 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: stepIndex === 1 ? "block" : "none" }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <UnderlinedTitle title="Experience & Skills" subtitle="Tell us your years and top strengths" />
                        <div className="text-xs text-muted-foreground">Step 2</div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input id="experience" type="number" min={0} max={50} placeholder="e.g., 3" {...register("experience")} />
                          {errors.experience && <p className="text-sm text-rose-500">{String(errors.experience.message)}</p>}
                        </div>

                        <div>
                          <Label htmlFor="skills">Skills</Label>
                          <Input id="skills" placeholder="e.g., Python, Product Management" {...register("skills")} />
                          <p className="text-xs text-muted-foreground mt-2">Comma separated. The AI parses tools, languages & strengths.</p>
                          {errors.skills && <p className="text-sm text-rose-500">{String(errors.skills.message)}</p>}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: stepIndex === 2 ? 1 : 0.3, y: stepIndex === 2 ? 0 : 8 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: stepIndex === 2 ? "block" : "none" }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <UnderlinedTitle title="Bio & Review" subtitle="Refine your story" />
                        <div className="text-xs text-muted-foreground">Step 3</div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea id="bio" className="h-36 mt-2" placeholder="One-line summary — what drives you" {...register("bio")} />
                        <p className="text-xs text-muted-foreground mt-2">Keep it short — the AI will expand and personalise messaging for you.</p>
                        {errors.bio && <p className="text-sm text-rose-500">{String(errors.bio.message)}</p>}

                        <div className="mt-6 border-t pt-4">

                          <h4 className="text-sm font-semibold mb-2">Quick review</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                              <strong>Industry:</strong> {watchIndustry ? industries.find((i) => i.id === watchIndustry)?.name : "—"}
                            </div>
                            <div>
                              <strong>Specialization:</strong> {watchSubIndustry ?? "—"}
                            </div>
                            <div>
                              <strong>Experience:</strong> {parsed.success ? parsed.data.experience : "—"} years
                            </div>
                            <div>
                              <strong>Skills:</strong>{" "}
                              {parsed.success ? (parsed.data.skills ?? []).join(", ") : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="mt-4 hidden md:flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (stepIndex === 0) {

                        } else goPrev();
                      }}
                      className="rounded-full px-4 py-2"
                      type="button"
                    >
                      Back
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    {stepIndex < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={goNext}
                        className="rounded-2xl px-5 py-2 cursor-pointer"
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="rounded-2xl px-5 py-2 flex items-center gap-2 cursor-pointer"
                        disabled={updateLoading}
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Complete Profile"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </form>
          </Card>
        </TiltCard>
      </div>
    </section>
  );
}

function useRouterSafe() {

  try {
    const { useRouter } = require("next/navigation");
    return useRouter();
  } catch {

    return {
      push: (p: string) => {
        if (typeof window !== "undefined") window.location.href = p;
      },
      refresh: () => {
        if (typeof window !== "undefined") window.location.reload();
      },
    } as any;
  }
}
