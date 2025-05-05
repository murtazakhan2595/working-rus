import React from "react";
import { Button } from "components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const CircularActionButtons = ({ 
  onEdit, 
  onDelete, 
  editTooltip = "Edit", 
  deleteTooltip = "Delete" 
}) => {
  return (
    <div className="flex space-x-2">
      {onEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(e);
                }}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-200 bg-white hover:bg-gray-100"
                aria-label="Edit"
                tabIndex="0"
              >
                <Pencil className="h-4 w-4 text-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{editTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {onDelete && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(e);
                }}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-gray-200 bg-white hover:bg-gray-100"
                aria-label="Delete"
                tabIndex="0"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{deleteTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default CircularActionButtons; 