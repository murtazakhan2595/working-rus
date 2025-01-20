import React, { useState } from "react";
import { Unlink2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { URLS } from "constants/config";

const TaskShare = ({projectId, taskId}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
    let frontendUrl = null;
    URLS.forEach((url) => {
      if (window.location.href.startsWith(url.Frontend)) {
        frontendUrl = (url.Frontend+ "/project-board/"+ projectId + "/"+ taskId)?.toString();
      }
    });

  const handleClick = () => {
    navigator.clipboard
      .writeText(frontendUrl)
      .then(() => {
        setTooltipOpen(true);
        setTimeout(() => setTooltipOpen(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            type="button"
            className="h-10 w-10 flex-col justify-center items-center gap-2 inline-flex bg-white rounded-3xl border border-[#e8e8ec]"
          >
            <Unlink2 size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copied!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TaskShare;
