import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { Button } from "components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";

const DropdownActionMenu = ({ 
  onView, 
  onEdit, 
  onDelete, 
  viewText = "View Profile", 
  editText = "Edit Profile", 
  deleteText = "Delete",
  menuTooltip = "Actions"
}) => {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{menuTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("View menu item clicked");
              onView(e);
            }}
            tabIndex="0"
            className="cursor-pointer"
          >
            {viewText}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Edit menu item clicked");
              onEdit(e);
            }}
            tabIndex="0"
            className="cursor-pointer"
          >
            {editText}
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Delete menu item clicked");
              onDelete(e);
            }}
            tabIndex="0"
            className="cursor-pointer"
          >
            {deleteText}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActionMenu; 