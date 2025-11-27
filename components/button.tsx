"use client";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center font-medium select-none transition-all duration-300 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: `
          bg-gray-900 text-white 
          hover:bg-gray-800 
          dark:bg-gray-100 dark:text-black 
          dark:hover:bg-gray-200
          shadow-sm hover:shadow-md
        `,

        secondary: `
          bg-gray-200 text-gray-900 
          hover:bg-gray-300 
          dark:bg-gray-800 dark:text-gray-100 
          dark:hover:bg-gray-700
          shadow-sm hover:shadow-md
        `,

        outline: `
          border border-gray-300 text-gray-900 
          hover:bg-gray-100 
          dark:border-gray-700 dark:text-gray-100 
          dark:hover:bg-gray-800
          shadow-sm hover:shadow-md
        `,

        ghost: `
          text-gray-700 
          hover:bg-gray-100 
          dark:text-gray-300 
          dark:hover:bg-gray-800
        `,
      },

      size: {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2 text-base rounded-xl",
        lg: "px-5 py-3 text-lg rounded-xl",
      },

      rounded: {
        normal: "rounded-xl",
        full: "rounded-full",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "normal",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button = ({ className, variant, size, rounded, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonStyles({ variant, size, rounded }), className)}
      {...props}
    />
  );
};
