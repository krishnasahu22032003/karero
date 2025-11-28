"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        p-4
        flex items-center justify-center
        cursor-pointer
        rounded-md
        bg-transparent
        hover:bg-gray-200 dark:hover:bg-gray-800
        transition-all duration-300
      "
    >
      <span className="relative flex items-center justify-center">
        
        {/* Sun Icon */}
        <Sun
          className="
            h-[1.2rem] w-[1.2rem]
            transition-all duration-300
            text-gray-600 dark:text-gray-300
            rotate-0 scale-100 opacity-100
            dark:-rotate-90 dark:scale-0 dark:opacity-0
          "
          style={{ position: "absolute" }}
        />

        {/* Moon Icon */}
        <Moon
          className="
            h-[1.2rem] w-[1.2rem]
            transition-all duration-300
            text-gray-600 dark:text-gray-300
            rotate-90 scale-0 opacity-0
            dark:rotate-0 dark:scale-100 dark:opacity-100
          "
          style={{ position: "absolute" }}
        />
      </span>

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
