"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { BrainCircuit, Sparkles, BarChart3 } from "lucide-react";

// Tilt Wrapper
type TiltCardProps = { children: React.ReactNode; };

const TiltCard: React.FC<TiltCardProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, s: 1 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rx = (py - 0.5) * -5; // slightly stronger for premium feel
    const ry = (px - 0.5) * 6;

    setT({ rx, ry, s: 1.03 });
  };

  const onLeave = () => setT({ rx: 0, ry: 0, s: 1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(1200px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,
      }}
      

      className="
        relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer
        backdrop-blur-sm
      "
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
       transition={{
    type: "spring",
    stiffness: 150,
    damping: 18,
    duration: 0.65,
    ease: [0.16, 1, 0.3, 1],
  }}
    >
      {/* Soft hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.14 }}
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.12), transparent 70%)",
        }}
      />

      {/* Subtle border sheen */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.22 }}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.06))",
        }}
      />

      {children}
    </motion.div>
  );
};

export default function AboutKarero() {
  return (
    <section
      id="about"
      className="
        relative w-full py-40 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto
      "
    >

   
<div
  className="
    absolute top-0 left-0 w-full h-24
    bg-gradient-to-b from-black/60 to-transparent
    dark:from-white/10 dark:to-transparent
    pointer-events-none
  "
/>


      {/* ▬▬▬ TEXT AREA ▬▬▬ */}
      <div className="text-center mb-28">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white"
        >
          About{" "}
          <span className="text-neutral-500 dark:text-neutral-300">
            Karero AI Coach
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="
            max-w-2xl mx-auto mt-6 
            text-gray-600 dark:text-gray-300/80 
            text-lg md:text-xl leading-relaxed
          "
        >
          Karero is your personal career acceleration engine — powered by advanced learning
          models, human-like coaching intelligence, and real-time feedback systems designed
          to make you unstoppable in your professional journey.
        </motion.p>
      </div>

      {/* ▬▬▬ GRID ▬▬▬ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BIG VIDEO CARD */}
        <TiltCard>
          <div className="
            relative h-[340px] md:h-[390px]
            bg-gradient-to-br from-gray-200 to-gray-300 
            dark:from-neutral-900 dark:to-neutral-800 
            rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.25)]
            overflow-hidden
          ">
            <video
              src="/bento-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            <div className="
              absolute inset-0 
              bg-gradient-to-t from-black/50 via-black/20 to-transparent 
              dark:from-black/60
            " />

            <div className="absolute bottom-7 left-7 right-7 z-10">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                AI-Powered Coaching
              </h3>
              <p className="text-gray-200 mt-3 text-sm leading-relaxed">
                Personalized skill-building, interview simulations, tailored guidance.
              </p>
            </div>
          </div>
        </TiltCard>

        {/* CARD 2 — NEEDS TO LOOK PREMIUM */}
        <TiltCard>
          <div className="
            h-[340px]
            rounded-3xl 
            bg-gradient-to-br from-white to-gray-100 
            dark:from-neutral-800 dark:to-neutral-700 
            shadow-xl p-10
            flex flex-col justify-between
            relative
          ">

            {/* Gradient stripe top */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/20 dark:via-white/10" />

            {/* Icon container upgrade */}
            <div className="
              w-14 h-14 rounded-2xl 
              bg-black/5 dark:bg-white/10 
              flex items-center justify-center
              shadow-inner
            ">
              <BrainCircuit className="w-8 h-8 text-black/70 dark:text-white/80" />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Understands Your Goals
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                Karero AI learns your patterns and adapts its coaching in real time — unlocking
                your strongest opportunities.
              </p>
            </div>
          </div>
        </TiltCard>

        {/* CARD 3 — PREMIUM LOOK */}
        <TiltCard>
          <div className="
            h-[340px] rounded-3xl 
            bg-gradient-to-br from-white to-gray-100 
            dark:from-neutral-800 dark:to-neutral-700 
            shadow-xl p-10 
            flex flex-col justify-between
            relative
          ">

            {/* Subtle highlight */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-black/10 via-black/5 to-transparent dark:from-white/20 dark:via-white/10" />

            <div className="
              w-14 h-14 rounded-2xl 
              bg-black/5 dark:bg-white/10 
              flex items-center justify-center
              shadow-inner
            ">
              <BarChart3 className="w-8 h-8 text-black/70 dark:text-white/80" />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Real-Time Skill Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                Every session improves your AI profile — revealing insights that sharpen
                decision-making and accelerate your journey.
              </p>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* ▬▬▬ BOTTOM WIDE CARD ▬▬▬ */}
      <TiltCard>
        <div className="
          mt-10 h-[330px] md:h-[380px] rounded-3xl 
          bg-gradient-to-br from-gray-200 to-gray-300 
          dark:from-neutral-900 dark:to-neutral-800 
          shadow-[0_25px_80px_rgba(0,0,0,0.3)]
          overflow-hidden relative
        ">

          <video
            src="/bento-video-2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.88]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

          <div className="absolute left-10 top-1/2 -translate-y-1/2 max-w-xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Your Career. Reimagined.
            </h3>
            <p className="text-gray-300 mt-3 leading-relaxed text-lg">
              Karero adapts to your pace with intelligent guidance that grows with you,
              helping you move confidently into the future.
            </p>
          </div>
        </div>
      </TiltCard>
    </section>
  );
}
