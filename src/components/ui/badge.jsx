import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../src/@/lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center w-fit h-fit text-nowrap rounded-full border border-slate-200 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
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
        "dot-plum":
          "bg-white border-neutral-300 flex items-center gap-2 text-neutral-1100",
        "dot-error": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-warning": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-emerald": "bg-white border-neutral-300 flex items-center gap-2",
        "dot-neutral": "bg-white border-neutral-300 flex items-center gap-2",
      },
      size: {
        sm: "text-sm px-4 py-2",
        default: "text-xs px-2 py-1",
        lg: "h-11 text-sm px-8",
        xl: "h-12 text-sm px-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Badge = React.forwardRef(
  ({ key, className, variant, size, dot, ...props }, ref) => {
    return (
      <div
        key={key}
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {dot && <span className={`w-3 h-3 rounded-full ${dot}`} />}
        {props.children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
