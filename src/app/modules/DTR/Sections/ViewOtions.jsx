import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import {
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Contact,
  Download,
  Hourglass,
  LayoutGrid,
  ListTodo,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

const VIEW_TYPES = {
  LIST: "list",
  GRID: "grid",
};

const ViewOptions = ({ activeView = "list", setActiveView = () => {} }) => {
  const viewButtons = [
    {
      icon: ListTodo ,
      isActive: activeView === VIEW_TYPES.LIST,
      onClick: () => setActiveView(VIEW_TYPES.LIST),
    },
    {
      icon: LayoutGrid,
      isActive: activeView === VIEW_TYPES.GRID,
      onClick: () => setActiveView(VIEW_TYPES.GRID),
    },
  ];
  const IconButton = ({ icon: Icon, isActive, onClick }) => {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn("h-8 w-10 rounded", isActive && "bg-fuchsia-50 text-plum-1100")}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
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
        />
      ))}
    </div>
  );
};

export default ViewOptions;
