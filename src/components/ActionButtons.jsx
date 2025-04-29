import React from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "src/@/components/ui/tooltip";

/**
 * Generic Action Buttons component for viewing, editing, and deleting items
 * @param {Object} props - Component props
 * @param {Function} props.onView - Handler for view action
 * @param {Function} props.onEdit - Handler for edit action
 * @param {Function} props.onDelete - Handler for delete action
 * @param {boolean} props.hideView - Flag to hide view button
 * @param {boolean} props.hideEdit - Flag to hide edit button
 * @param {boolean} props.hideDelete - Flag to hide delete button
 * @param {string} props.viewTooltip - Custom tooltip text for view button
 * @param {string} props.editTooltip - Custom tooltip text for edit button
 * @param {string} props.deleteTooltip - Custom tooltip text for delete button
 */
const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  hideView = false,
  hideEdit = false,
  hideDelete = false,
  viewTooltip = "View Details",
  editTooltip = "Edit",
  deleteTooltip = "Delete",
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {!hideView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-3 transition-colors border rounded-full text-emerald-500 border-emerald-100 hover:bg-emerald-50 shadow-custom"
                onClick={onView}
                aria-label={viewTooltip}
              >
                <Eye className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{viewTooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {!hideEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-3 transition-colors border rounded-full text-amber-500 border-amber-100 hover:bg-amber-50 shadow-custom"
                onClick={onEdit}
                aria-label={editTooltip}
              >
                <Edit className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{editTooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {!hideDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-3 transition-colors border rounded-full text-red-500 border-red-100 hover:bg-red-50 shadow-custom"
                onClick={onDelete}
                aria-label={deleteTooltip}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{deleteTooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ActionButtons; 