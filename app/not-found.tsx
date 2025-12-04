"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center relative">

      {/* Soft top glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-black/10 to-transparent dark:from-white/10 dark:to-transparent blur-2xl pointer-events-none" />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          text-6xl md:text-7xl font-extrabold tracking-tight 
          text-black dark:text-white mb-4
        "
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-2xl md:text-3xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4"
      >
        Page Not Found
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="
          max-w-lg mx-auto 
          text-neutral-600 dark:text-neutral-400 
          text-base md:text-lg leading-relaxed mb-10
        "
      >
        The page you’re trying to reach doesn’t exist or may have been moved.
        Let’s guide you back to familiar territory.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Link href="/">
          <Button
            className="
              px-6 py-3 rounded-full font-medium text-base
              bg-black text-white hover:bg-black/80 
              dark:bg-white dark:text-black dark:hover:bg-white/80
              transition-all shadow-[0_8px_30px_rgba(0,0,0,0.25)]
              dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)]
            "
          >
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
