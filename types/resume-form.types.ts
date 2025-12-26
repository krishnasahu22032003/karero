// resume-form.types.ts
export type ResumeFormValues = {
  contactInfo: {
    email?: string;
    mobile?: string;
    linkedin?: string;
    twitter?: string;
  };
  summary: string;
  skills: string;
  experience: Entry[];
  education: Entry[];
  projects: Entry[];
};

export type Entry = {
  title: string;
  organization: string;
  startDate: string;
  description: string;
  current: boolean;
  endDate?: string;
};
