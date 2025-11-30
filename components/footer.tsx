"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="
        relative w-full 
        pt-8 pb-6
        bg-linear-to-b from-transparent to-gray-100
        dark:from-transparent dark:to-neutral-900
        border-t border-gray-900/40 dark:border-white/10
      "
    >

      <div
        className="
          absolute -top-5 left-1/2 -translate-x-1/2 
          w-[180px] h-10
          bg-white/20 dark:bg-white/5 
          blur-xl rounded-full pointer-events-none
          opacity-60
        "
      />


      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
     
        <h2
          className="
            text-lg font-semibold tracking-tight 
            text-black dark:text-white opacity-90
          "
        >
          Karero AI Coach
        </h2>

        <div
          className="
            w-12 h-0.5 mx-auto mt-3 mb-5
            bg-linear-to-r 
            from-black/40 via-black/20 to-transparent
            dark:from-white/30 dark:via-white/15 dark:to-transparent
            rounded-full
          "
        />


        <p
          className="
            text-xs text-gray-600 dark:text-gray-400
            tracking-wide flex items-center justify-center gap-1
          "
        >
          Made with 
          <Heart 
            className="
              w-3.5 h-3.5 
              text-black/70 dark:text-white/70 
              transition
              group-hover:scale-110
            " 
            strokeWidth={2}
            fill="red"
          /> 
          <span className="font-medium">Krishna Sahu</span>
        </p>


        <p
          className="
            text-[11px] mt-2 
            text-gray-500 dark:text-gray-500 
            tracking-wide
          "
        >
          © {new Date().getFullYear()} Karero — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
