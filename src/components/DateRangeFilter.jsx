import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import { Header } from "components";
import { Card, CardHeader, CardContent } from "components/ui/card";
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
const TIME_FILTERS = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
};

const VIEW_TYPES = {
  LIST: "list",
  GRID: "grid",
};

const DateRangeFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState(TIME_FILTERS.WEEK);
  const [selectedView, setSelectedView] = useState(VIEW_TYPES.LIST);

  const timeFilters = [
    {
      text: TIME_FILTERS.DAY,
      isActive: selectedFilter === TIME_FILTERS.DAY,
      onClick: () => setSelectedFilter(TIME_FILTERS.DAY),
    },
    {
      text: TIME_FILTERS.WEEK,
      isActive: selectedFilter === TIME_FILTERS.WEEK,
      onClick: () => setSelectedFilter(TIME_FILTERS.WEEK),
    },
    {
      text: TIME_FILTERS.MONTH,
      isActive: selectedFilter === TIME_FILTERS.MONTH,
      onClick: () => setSelectedFilter(TIME_FILTERS.MONTH),
    },
  ];

  const viewButtons = [
    {
      icon: LayoutGrid,
      isActive: selectedView === VIEW_TYPES.LIST,
      onClick: () => setSelectedView(VIEW_TYPES.LIST),
    },
    {
      icon: ListTodo,
      isActive: selectedView === VIEW_TYPES.GRID,
      onClick: () => setSelectedView(VIEW_TYPES.GRID),
    },
  ];

  const IconButton = ({ icon: Icon, isActive, onClick }) => {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-10",
          isActive && "bg-fuchsia-50",
          !isActive && "bg-white"
        )}
      >
        <Icon className="h-4 w-4 text-plum-1100" aria-hidden="true" />
      </Button>
    );
  };

  const TimeFilterButton = ({ text, isActive, onClick }) => {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 text-sm font-medium leading-tight",
          isActive && "bg-fuchsia-50 text-fuchsia-700",
          !isActive && "text-neutral-400"
        )}
      >
        {text}
      </Button>
    );
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap gap-1 items-center self-stretch p-1 my-auto bg-white rounded-xl border border-gray-100 border-solid min-h-[40px] min-w-[240px] max-md:max-w-full">
          {timeFilters.map((filter, index) => (
            <TimeFilterButton
              key={index}
              text={filter.text}
              isActive={filter.isActive}
              onClick={filter.onClick}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 text-neutral-400"
          >
            <CalendarDays />
            <span>11 Nov 2024 - 15 Nov 2024</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default DateRangeFilter;
