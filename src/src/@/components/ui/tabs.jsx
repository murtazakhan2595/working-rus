import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ScrollArea, ScrollBar } from "src/@/components/ui/scroll-area";
import { cn } from "../../../@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <ScrollArea className="">
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          " flex flex-row w-full max-w-fit inline-flex h-fit gap-4 items-center rounded-sm bg-white p-1 text-neutral-900 dark:bg-slate-800 dark:text-slate-400 mb-4",
          className
        )}
        {...props} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ variant, className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center  whitespace-nowrap rounded-sm px-3 py-1.5 text-sm ring-offset-white text-neutral-900 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 data-[state=active]:font-medium data-[state=active]:shadow-sm dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-slate-50",
      variant === 'inner-tab' ? "shadow-none border-transparent border-b data-[state=active]:border-plum-1100 w-fit data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium" : "",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
