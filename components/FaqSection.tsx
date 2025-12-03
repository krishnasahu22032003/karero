"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is Karero AI Coach?",
    a: "Karero is your personal AI-powered speaking coach that helps you improve interviews, presentations, clarity, confidence, tone, and delivery with real-time guidance.",
  },
  {
    q: "How accurate is the AI feedback?",
    a: "Karero uses advanced speech analysis and NLP engines to give precise, actionable feedback on tone, clarity, pace, filler words, confidence, and communication patterns.",
  },
  {
    q: "Can Karero help with interview preparation?",
    a: "Absolutely. Karero simulates real interview sessions, evaluates your responses, and gives you personalized improvement points tailored to your dream role.",
  },

  // Extra questions
  {
    q: "Does Karero help build AI-optimized resumes?",
    a: "Yes — Karero's Resume Builder uses ATS-friendly structure, role-specific keywords, and phrasing enhancements so your resume stands out for both recruiters and automated systems.",
  },
  {
    q: "Can Karero write a tailored cover letter?",
    a: "Karero generates personalized cover letters based on your resume, job role, and writing tone — whether formal, balanced, or conversational.",
  },
  {
    q: "What market insights does Karero provide?",
    a: "Karero provides data-driven role insights, trending skills, salary benchmarks, and career demand patterns — helping you position yourself better in the job market.",
  },
  {
    q: "Does Karero support exporting resumes and cover letters?",
    a: "Absolutely. You can export your resume or cover letter in PDF format with clean, professional, ATS-friendly design.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 mx-auto"
    >
      <div
        className="
          absolute top-0 left-0 w-full h-24
          bg-linear-to-b from-black/10 to-transparent
          dark:from-white/10 dark:to-transparent
          pointer-events-none
        "
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-black dark:text-white">
          Frequently Asked{" "}
          <span className="text-neutral-500 dark:text-neutral-300">Questions</span>
        </h2>

        <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-300/90 text-sm md:text-base mt-4 leading-relaxed">
          Everything you need to know — from resume building to market insights and AI coaching.
        </p>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        className="mt-14 md:mt-16 max-w-4xl mx-auto space-y-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.08 }}
      >
        {faqs.map((item, i) => {
          const isOpen = open === i;

          return (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" }},
              }}
              className="
                rounded-2xl
                bg-linear-to-br from-white to-gray-100 
                dark:from-neutral-900 dark:to-neutral-800
                border border-gray-200/40 dark:border-white/10
                shadow-[0_10px_40px_rgba(0,0,0,0.1)]
                dark:shadow-[0_18px_70px_rgba(0,0,0,0.45)]
                hover:shadow-[0_18px_55px_rgba(0,0,0,0.18)]
                dark:hover:shadow-[0_26px_80px_rgba(0,0,0,0.6)]
                overflow-hidden transition-all duration-300
              "
            >
              {/* Question */}
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full px-6 py-5 flex justify-between items-center text-left group"
              >
                <motion.h3
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  className="text-base md:text-lg font-semibold text-black dark:text-white"
                >
                  {item.q}
                </motion.h3>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white"
                >
                  <ChevronDown size={22} />
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    className="px-6 pb-6"
                  >
                    <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
