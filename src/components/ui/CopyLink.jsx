import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { initialState } from "state/slices/UserSlice";
import { Link } from "lucide-react";

const frontendURL = initialState.frontendURL;

/**
 * CopyLink Component
 *
 * A reusable component to copy a project board link to the clipboard.
 * Displays a tooltip message upon successful copying.
 *
 * @param {string} link - The relative project board link (default: '').
 * @param {string} text - The text displayed in the UI (default: 'Copy Card Link').
 * @param {string} message - The tooltip message when copied (default: 'Copied').
 * @param {string} directCopy – Implies copying the link as-is, without modification.
 * @returns {JSX.Element} - The CopyLink component.
 */
const CopyLink = React.memo(
  ({
    link = "",
    text = "",
    message = "Copied!",
    linkIcon = <Link size={14} className="mr-2" />,
    directCopy = false,
    textClassName = "text-neutral-1100",
  }) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    /**
     * Handles the copy action when the user clicks the component.
     * Copies the full project board URL to the clipboard and shows a tooltip.
     *
     * @param {React.MouseEvent} event - The click event.
     */
    const handleCopyClick = (event) => {
      event.preventDefault();

      const fullUrl = directCopy ? link : `${frontendURL}${link}`;

      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          setTooltipVisible(true);
          setTimeout(() => setTooltipVisible(false), 2000);
        })
        .catch((error) => console.error("Failed to copy:", error));
    };

    return (
      <div onClick={handleCopyClick} className="cursor-pointer">
        <TooltipProvider>
          <Tooltip open={tooltipVisible}>
            <TooltipTrigger asChild>
              <span className={`${textClassName} flex items-center`}>
                {linkIcon}
                {text}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

export default CopyLink;
