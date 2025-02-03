import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const TooltipText = React.memo(({ tooltipTriggerText, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{tooltipTriggerText}</TooltipTrigger>
        <TooltipContent><div>{content}</div></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default TooltipText;
