"use client";

import { motion, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { Briefcase, Bot, BookOpen, FileText } from "lucide-react";

/* ------------------------------------------------------------ */
/*                     FIXED TILT CARD                          */
/* ------------------------------------------------------------ */

const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, s: 1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setT({
      rx: (py - 0.9) * -10,
      ry: (px - 0.9) * 12,
      s: 1.05,
    });
  };

  const onLeave = () => setT({ rx: 0, ry: 0, s: 1 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-3xl cursor-pointer overflow-hidden"
    >
      {/* Glow */}
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none 
          opacity-0 group-hover:opacity-20 transition duration-500
        "
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.14), transparent 70%)",
        }}
      />

      {/* Sheen */}
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none
          opacity-0 group-hover:opacity-25 transition duration-500
        "
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05), rgba(255,255,255,0.08))",
        }}
      />

      {/* Tilt transform wrapper */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,
          transition: "transform 120ms ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ */
/*                      ORIGINAL CODE                           */
/* ------------------------------------------------------------ */

const titleVariant: Variants = {
  initial: { opacity: 0, y: 8, letterSpacing: "-0.03em" },
  animate: {
    opacity: 1,
    y: 0,
    letterSpacing: "0em",
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const items = [
  { icon: <FileText size={26} />, title: "AI Resume Optimizer", desc: "Rewrite, enhance, and ATS-optimize your resume instantly." },
  { icon: <Bot size={26} />, title: "Mock Interview Coach", desc: "Practice interviews with real-time feedback on answers." },
  { icon: <Briefcase size={26} />, title: "Job Search Assistant", desc: "Understand job descriptions and get personalized suggestions." },
  { icon: <BookOpen size={26} />, title: "Learning Companion", desc: "Learn any tech concept with examples, plans, and guidance." },
];

export default function UseCases() {
  return (
    <section id="features" className="relative w-full py-28 px-6 md:px-16 lg:px-24">
      <div
        className="
          absolute top-5 left-0 w-full h-24
          bg-gradient-to-b from-black/20 to-transparent
          dark:from-white/10 dark:to-transparent
          pointer-events-none
        "
      />

      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.2, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black dark:text-zinc-100">
          What{" "}
          <span className="text-neutral-500 dark:text-neutral-300">
            You Can Do With karero AI
          </span>
        </h2>

        <p className="max-w-xl text-gray-600 dark:text-gray-300/90 text-sm md:text-base leading-relaxed">
          Your AI-powered coach to help you prepare, learn, and land your dream job.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <TiltCard key={i}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                scale: 1.04,
                translateY: -6,
              }}
              className="
                group relative rounded-3xl p-7 
                bg-gradient-to-br from-white to-gray-100
                dark:from-neutral-900 dark:to-neutral-800
                shadow-[0_10px_35px_rgba(0,0,0,0.14)]
                dark:shadow-[0_18px_70px_rgba(0,0,0,0.55)]
                border border-gray-200/40 dark:border-white/10
                transition-all duration-300 
                overflow-hidden
              "
            >
              {/* Title Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition duration-500 bg-gradient-to-br from-blue-400/20 via-purple-400/10 to-transparent dark:from-blue-500/10 dark:via-purple-500/5 blur-xl" />

              {/* Icon */}
              <div
                className="
                  w-12 h-12 rounded-xl flex items-center justify-center
                  bg-black/5 dark:bg-white/10
                  text-black/80 dark:text-white/90
                  backdrop-blur-sm mb-5
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                {item.icon}
              </div>

              {/* Title */}
              <motion.h3
                variants={titleVariant}
                initial="initial"
                animate="animate"
                className="relative text-lg font-semibold text-black dark:text-zinc-100 tracking-tight mb-2"
              >
                {item.title}

                <span
                  className="
                    absolute left-0 -bottom-1 h-[2px] w-0 
                    bg-gradient-to-r 
                    from-black/40 via-black/20 to-transparent
                    dark:from-white/40 dark:via-white/20 dark:to-transparent
                    transition-all duration-500
                    group-hover:w-full
                  "
                />
              </motion.h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
