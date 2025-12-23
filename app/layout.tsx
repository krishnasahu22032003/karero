import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs"
import {dark} from "@clerk/themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Karero – AI Career Coach | Personalized Career Guidance, Resume Builder & Interview Prep",
  description:
    "Karero is an advanced AI-powered career coach that helps you choose the right career path, optimize your resume, prepare for interviews, analyze skills, and discover job opportunities. Experience a futuristic, elegant, and highly personalized coaching platform designed to accelerate your professional growth.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      theme:dark
    }}>
      <html lang="en" suppressContentEditableWarning >
        <body
          className={`${inter.className}`}
        >
          <ThemeProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
