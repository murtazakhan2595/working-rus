import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "../../src/@/lib/utils.js"

const badgeVariants = cva(
  "inline-flex items-center text-nowrap rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
        secondary:
          "border-transparent bg-slate-100 text-slate-900  dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50  dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-900 dark:text-slate-50",
        plum: "bg-plum-300 text-plum-1100",
        error: "bg-red-100 text-red-500",
        warning: "bg-amber-100 text-amber-500",
        success: "bg-emerald-100 text-emerald-500",
        neutral: "bg-neutral-300 text-neutral-1100",
        "dot-plum": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-error": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-warning": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-emerald": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-neutral": "bg-white border-neutral-300 flex items-center gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  key,
  className,
  variant,
  dot,
  ...props
}) {
  return (
    <div key={key} className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span className={`w-3 h-3 rounded-full ${dot}`} />}
      {props.children}
    </div>
  );
}

export { Badge, badgeVariants }
