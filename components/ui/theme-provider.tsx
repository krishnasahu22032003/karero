"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children } : ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
