import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { Link } from "react-router-dom"; // Import Link

import { cn } from "../../src/@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-1200 text-white hover:bg-black hover:text-white hover:shadow-custom  dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-300 text-white hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        success: "bg-emerald-600 text-white hover:bg-emerald-600/90",
        continue:
          "border text-neutral-1200 border-slate-700 bg-white hover:shadow-custom dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        outline:
          "border border-primary bg-white hover:bg-primary text-primary hover:shadow-custom hover:text-white dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        primary:
          "border border-primary bg-primary hover:bg-primary-dark text-white hover:shadow-custom hover:text-white",
        secondary:
          "bg-gray-1200 text-slate-100 hover:bg-gray-1100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-neutral-1000 underline-offset-4 hover:underline dark:text-slate-50",
        destructiveOutline:
          "hover:bg-red-50 text-red-700 border border-red-700",
        successOutline:
          "border border-emerald-600 text-emerald-600 hover:bg-emerald-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-12 px-9",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, to, ...props }, ref) => {
    // If "to" exists, use "Link" for navigation; otherwise, use a button
    const Comp = asChild ? Slot : to ? Link : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        {...(to ? { to } : {})} // Add "to" prop only if it exists
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
