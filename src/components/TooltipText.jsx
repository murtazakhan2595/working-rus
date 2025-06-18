import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { cn } from "src/@/lib/utils.js";

const TooltipText = React.memo(({ content, className, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className={cn(className, "text-neutral-1100 text-xs")}>
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default TooltipText;
