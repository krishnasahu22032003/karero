"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { BrainCircuit, BarChart3 } from "lucide-react";

type TiltCardProps = { children: React.ReactNode };

const TiltCard: React.FC<TiltCardProps> = ({ children }) => {
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
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="
        group relative rounded-3xl overflow-hidden cursor-pointer
        backdrop-blur-sm transition-all duration-300
      "
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 18,
      }}
    >
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none
          opacity-0 group-hover:opacity-20 transition duration-500
        "
        style={{
          background:
            "radial-linear(circle at 50% 20%, rgba(255,255,255,0.14), transparent 70%)",
        }}
      />

    
      <div
        className="
          absolute inset-0 rounded-3xl pointer-events-none
          opacity-0 group-hover:opacity-25 transition duration-500
        "
        style={{
          background:
            "linear-linear(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05), rgba(255,255,255,0.1))",
        }}
      />

    
      <div
        style={{
          transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) scale(${t.s})`,
          transition: "transform 120ms ease-out",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};



export default function AboutKarero() {
  return (
    <section
      id="about"
      className="relative w-full py-29 px-6 md:px-16 lg:px-24 mx-auto"
    >
      <div
        className="
          absolute top-0 left-0 w-full h-24
          bg-linear-to-b from-black/20 to-transparent
          dark:from-white/10 dark:to-transparent
          pointer-events-none
        "
      />

    
      <div className="text-center mb-28">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-4xl font-extrabold tracking-tight text-black dark:text-white"
        >
          About  Karero{" "}
          <span className="text-neutral-500 dark:text-neutral-300">
            AI Coach
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
            text-lg md:text-base leading-relaxed
          "
        >
          Karero is your personal career acceleration engine — powered by advanced learning
          models and intelligent feedback designed to make you unstoppable.
        </motion.p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

     
        <TiltCard>
          <div
            className="
              relative h-[340px] md:h-[390px]
              bg-linear-to-br from-gray-200 to-gray-300 
              dark:from-neutral-900 dark:to-neutral-800 
              rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.25)]
              overflow-hidden
            "
          >
            <video
              src="/bento-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent dark:from-black/60" />

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

  
        <TiltCard>
          <div
            className="
              h-[340px] rounded-3xl p-10 flex flex-col justify-between relative
              bg-linear-to-br from-white to-gray-100
              dark:from-neutral-900 dark:to-neutral-800
              border border-gray-200/40 dark:border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.15)]
              dark:shadow-[0_18px_70px_rgba(0,0,0,0.55)]
            "
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-black/10 via-black/5 to-transparent dark:from-white/20 dark:via-white/10" />

            <div
              className="
                w-14 h-14 rounded-2xl 
                bg-black/5 dark:bg-white/10 flex items-center justify-center shadow-inner
              "
            >
              <BrainCircuit className="w-8 h-8 text-black/70 dark:text-white/80" />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white relative inline-block">
                Understands Your Goals
                <span
                  className="
                    absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full
                    bg-linear-to-r from-black/40 via-black/20 to-transparent
                    dark:from-white/40 dark:via-white/20 dark:to-transparent
                    transition-all duration-500
                  "
                />
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                Karero learns your patterns and adapts its coaching in real time.
              </p>
            </div>
          </div>
        </TiltCard>

        <TiltCard>
          <div
            className="
              h-[340px] rounded-3xl p-10 flex flex-col justify-between relative
              bg-linear-to-br from-white to-gray-100
              dark:from-neutral-900 dark:to-neutral-800
              border border-gray-200/40 dark:border-white/10
              shadow-[0_10px_40px_rgba(0,0,0,0.15)]
              dark:shadow-[0_18px_70px_rgba(0,0,0,0.55)]
            "
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-black/10 via-black/5 to-transparent dark:from-white/20 dark:via-white/10" />

            <div
              className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shadow-inner"
            >
              <BarChart3 className="w-8 h-8 text-black/70 dark:text-white/80" />
            </div>

            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white relative inline-block">
                Real-Time Skill Tracking
                <span
                  className="
                    absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full
                    bg-linear-to-r from-black/40 via-black/20 to-transparent
                    dark:from-white/40 dark:via-white/20 dark:to-transparent
                    transition-all duration-500
                  "
                />
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                Every session improves your AI profile and sharpens your decision-making.
              </p>
            </div>
          </div>
        </TiltCard>
      </div>

     
      <TiltCard>
        <div
          className="
            mt-10 h-[330px] md:h-[380px] rounded-3xl 
            bg-linear-to-br from-gray-200 to-gray-300 
            dark:from-neutral-900 dark:to-neutral-800 
            shadow-[0_25px_80px_rgba(0,0,0,0.3)]
            overflow-hidden relative
          "
        >
          <video
            src="/bento-video-2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.88]"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent" />

          <div className="absolute left-10 bottom-0 -translate-y-1/2 max-w-xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Your Career. Reimagined.
            </h3>
            <p className="text-gray-300 mt-3  leading-relaxed text-lg">
              Karero adapts with intelligent guidance that grows with you.
            </p>
          </div>
        </div>
      </TiltCard>
    </section>
  );
}
