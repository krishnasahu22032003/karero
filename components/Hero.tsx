"use client";
import { Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import { SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "./button";
const WORDS = ["better", "faster", "smarter", "clearer"];
const CYCLE_MS = 2500; 

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState({ rx: 0, ry: 0, s: 1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; 
    const py = (e.clientY - rect.top) / rect.height; 
    const ry = (px - 0.9) * 10;
    const rx = (py - 0.9) * -6;
    const s = 1.015;
    setCardTransform({ rx, ry, s });
  };

  const onLeave = () => setCardTransform({ rx: 0, ry: 0, s: 1 });



 const container: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.09,
      when: "beforeChildren",
      ease: "easeInOut"
    }
  }
} as const;

 const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
} as const;




  return (
    <section id="hero" className="relative h-screen w-full max-w-[1400px] mx-auto px-6 md:px-12 -mt-6 md:-mt-10 pt-8 md:pt-20">

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute -left-24 top-10 md:-left-36 md:top-12 w-[480px] h-[360px] rounded-full blur-3xl"
        style={{
          background:
            "radial-linear(closest-side, rgba(255,255,255,0.03), rgba(120,120,120,0.01) 30%, transparent 60%)",
          mixBlendMode: "soft-light"
        }}
      />

      <motion.div
        initial="hidden"
        animate={mounted ? "show" : "hidden"}
        variants={container}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
      >
 
        <motion.div variants={item} className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
  <span
    className="
      inline-flex items-center gap-2 px-4 py-1.5 rounded-full
      text-sm font-medium
      bg-linear-to-r from-black/10 to-black/5 
      dark:from-white/10 dark:to-white/5
      border border-black/10 dark:border-white/10
      text-black/70 dark:text-white/80
      shadow-sm backdrop-blur-md
    "
  >
    <svg
      className="w-4 h-4 opacity-80"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
    </svg>

    <span>Introducing Karero AI Coach</span>
  </span>
</div>


          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-black dark:text-zinc-100"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="block">Build your career</span>
            <span className=" flex items-center mt-2">
              <span className="text-neutral-600 dark:text-neutral-300 mr-2 text-2xl md:text-6xl font-extrabold">10×</span>

       
              <span className="relative inline-flex">
<AnimatePresence mode="wait">
  <motion.span
    key={index}
    initial={{ opacity: 0, y: 10, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -6, scale: 0.98 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="
      inline-flex items-center justify-center px-4 py-2 rounded-2xl

      /* ✨ LIGHT MODE — more visible */
      text-gray-900
      bg-linear-to-br from-gray-100 via-gray-200 to-gray-300
      border border-gray-300/70
      shadow-[0_8px_25px_rgba(0,0,0,0.22)]
      backdrop-blur-[6px]

      /* 🌙 DARK MODE — unchanged */
      dark:text-black
      dark:bg-linear-to-br dark:from-white/80 dark:via-white/70 dark:to-white/90
      dark:shadow-[0_12px_40px_rgba(255,255,255,0.03)]
    "
    style={{
      minWidth: 86,
      textAlign: "center",
      fontWeight: 700,
    }}
  >
    {WORDS[index]}
  </motion.span>
</AnimatePresence>

            
                <motion.span
                  whileHover={{ x: 6, opacity: 1 }}
                  initial={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 40px rgba(255,255,255,0.03)",
                    mixBlendMode: "overlay"
                  }}
                />
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-gray-600 dark:text-gray-300/90 text-lg md:text-lg"
          >
            Karero is your AI career partner — personalized learning plans, interview simulations,
            feedback loops, and opportunity matching designed to accelerate your path to the next level.
            Built with privacy-first ML and enterprise-grade tooling.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 mt-4">
            <SignedOut>
              <SignUpButton>
                <Button variant="primary" className="rounded-full px-8 py-2">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            
            <SignedOut>
              <SignInButton>
                <Button variant="primary" className="rounded-full px-8 py-2">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
           
          </motion.div>

   
      <motion.div 
  variants={item}
  className="mt-8 flex items-center gap-5"
>

  <span className="
    text-xs font-medium tracking-wide
    text-gray-500 dark:text-gray-400
    uppercase opacity-80
  ">
    Trusted by teams
  </span>


  <div className="flex items-center gap-3">
    
    
    {["Nexus", "Rapid", "Trident"].map((brand, i) => (
      <motion.div
        key={i}
        whileHover={{ scale: 1.15, rotate: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="
          relative h-9 w-9 rounded-xl
          flex items-center justify-center
          text-[0.65rem] font-semibold

          bg-linear-to-br 
          from-white/70 to-gray-200/70 
          dark:from-white/10 dark:to-white/3

          text-gray-800 dark:text-white/80
          backdrop-blur-xl
          shadow-[0_5px_20px_-4px_rgba(0,0,0,0.3)]
          dark:shadow-[0_5px_20px_-4px_rgba(255,255,255,0.08)]

          border border-black/5 dark:border-white/10
          cursor-default overflow-hidden
        "
      >

      

  
        {brand[0]}

       

      </motion.div>
    ))}

  </div>

</motion.div>
</motion.div>

        
<motion.div variants={item} className="relative flex items-center justify-center">


  <motion.div
    className="absolute inset-0 rounded-3xl pointer-events-none"
    animate={{
      backgroundPosition: ["0% 0%", "200% 200%", "0% 0%"],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{
      background: `
        linear-linear(
          120deg,
          rgba(255,255,255,0.0) 0%,
          rgba(255,255,255,0.15) 40%,
          rgba(255,255,255,0.0) 80%
        )
      `,
      backgroundSize: "250% 250%",
      mixBlendMode: "overlay",
      filter: "blur(8px)"
    }}
  />

<div
  ref={cardRef}
  onMouseMove={onMove}
  onMouseLeave={onLeave}
  style={{
    transform: `perspective(1200px) rotateX(${cardTransform.rx}deg) rotateY(${cardTransform.ry}deg)`,
    transition: "transform 120ms ease-out",
  }}
  className="
    relative w-full max-w-[620px] h-[420px] md:h-[400px]
    rounded-3xl overflow-hidden
    bg-linear-to-br from-gray-200 to-gray-400
    dark:from-neutral-900 dark:to-neutral-800
    shadow-[0_20px_70px_rgba(0,0,0,0.25)]
    dark:shadow-[0_28px_90px_rgba(0,0,0,0.7)]
    backdrop-blur-xl
    hover:scale-[1.02]
    hover:shadow-[0_30px_110px_rgba(0,0,0,0.3)]
    transition-all duration-300
    group
  "
>

    <div className="absolute inset-0 flex items-center justify-center">
      <video
        src="/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="
          w-[92%] h-[92%] rounded-2xl object-cover 
          bg-black/20 dark:bg-white/5
          shadow-inner
          transition-all duration-300
          group-hover:scale-[1.02]
        "
      />
    </div>


    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: [0.03, 0.08, 0.03] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-white/20 dark:bg-white/5 blur-3xl" />
    </motion.div>

  </div>
</motion.div>


      </motion.div>
    </section>
  );
}
