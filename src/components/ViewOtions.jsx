import React from "react";
import { Button } from "components/ui/button";
import { TooltipText } from "components";
import { cn } from "src/@/lib/utils";
import { ListTodo, LayoutGrid } from "lucide-react";

const VIEW_TYPES = {
  LIST: "list",
  GRID: "grid",
};

const ViewOptions = React.memo(
  ({ activeView = "list", setActiveView = () => {} }) => {
    const viewButtons = [
      {
        icon: ListTodo,
        isActive: activeView === VIEW_TYPES.LIST,
        onClick: () => setActiveView(VIEW_TYPES.LIST),
        tooltipText: "List View",
      },
      {
        icon: LayoutGrid,
        isActive: activeView === VIEW_TYPES.GRID,
        tooltipText: "Board View",
        onClick: () => setActiveView(VIEW_TYPES.GRID),
      },
    ];

    const IconButton = ({ icon: Icon, isActive, onClick, tooltipText }) => {
      return (
        <Button
          onClick={onClick}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-10 rounded",
            isActive && "bg-fuchsia-50 text-plum-1100"
          )}
        >
          <TooltipText content={tooltipText}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </TooltipText>
        </Button>
      );
    };

    return (
      <div className="flex gap-1 items-center self-stretch p-1 my-auto bg-white rounded min-h-[40px] text-neutral-900">
        {viewButtons.map((button, index) => (
          <IconButton
            key={index}
            icon={button.icon}
            isActive={button.isActive}
            onClick={button.onClick}
            tooltipText={button.tooltipText}
          />
        ))}
      </div>
    );
  }
);

export default ViewOptions;
