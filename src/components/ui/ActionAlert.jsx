import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog"; // Adjust import path if needed
import { cn } from "src/@/lib/utils.js";

// Allowed Message Types
const MESSAGE_TYPES = {
  SUCCESS: "text-emerald-500",
  ERROR: "text-red-700",
  WARNING: "text-amber-500",
};

/**
 * ActionAlert Component
 *
 * @param {boolean} isOpen - Controls dialog visibility
 * @param {Function} onClose - Function to close the dialog
 * @param {string} title - Dialog title
 * @param {string} description - Dialog description
 * @param {string} messageType - Type of message (SUCCESS, ERROR, WARNING)
 * @param {string} className - Custom class for description
 * @param {string} titleClass - Custom class for title
 */
const ActionAlert = ({
  isOpen = false,
  onClose = () => {},
  title = "",
  description = "",
  messageType = "SUCCESS",
  className = "",
  titleClass = "",
}) => {
  // Determine title color based on message type
  const titleClassName = useMemo(
    () => MESSAGE_TYPES[messageType.toUpperCase()] || MESSAGE_TYPES.SUCCESS,
    [messageType]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className="z-[999]">
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle
              className={cn(titleClass, titleClassName, "font-semibold")}
            >
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        {description && (
          <p className={cn(className, "text-neutral-1100 font-normal text-sm")}>
            {description}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActionAlert;
