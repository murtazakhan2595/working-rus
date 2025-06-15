import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { cn } from "src/@/lib/utils.js";

const TooltipText = React.memo(({ tooltipTriggerText, content, className }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{tooltipTriggerText}</TooltipTrigger>
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
