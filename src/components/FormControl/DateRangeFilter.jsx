import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import moment from "moment";
import { CardContent } from "components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import { format, parse, isValid } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { Calendar } from "src/@/components/ui/calendar";

const TIME_FILTERS = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
};

const buttonClassName = "h-8 px-3 text-sm font-medium leading-tight rounded";
const activeButtonClassName = "bg-fuchsia-50 text-fuchsia-700";

const DateRangeFilter = React.memo(({ setDateRange = () => {}, activeDateRange = "Week" }) => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(null);
  const [dateRange, setDateRangeState] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (activeDateRange.toUpperCase() === "DAY") {
      setSelectedTimeFilter(TIME_FILTERS.DAY);
    } else if (activeDateRange.toUpperCase() === "WEEK") {
      setSelectedTimeFilter(TIME_FILTERS.WEEK);
    } else if (activeDateRange.toUpperCase() === "MONTH") {
      setSelectedTimeFilter(TIME_FILTERS.MONTH);
    } else {
      setSelectedTimeFilter(activeDateRange);
      // Parse date range if it's a string
      if (typeof activeDateRange === 'string' && activeDateRange.includes(',')) {
        setDateRangeState(parseDateRange(activeDateRange));
      }
    }
  }, [activeDateRange]);

  const parseDateRange = (dateRangeValue) => {
    const dateRange = dateRangeValue ? dateRangeValue?.split(",") : null;
    return {
      from:
        dateRange &&
        dateRange[0] &&
        isValid(parse(dateRange[0], "yyyy-MM-dd", new Date()))
          ? parse(dateRange[0], "yyyy-MM-dd", new Date())
          : null,
      to:
        dateRange &&
        dateRange[1] &&
        isValid(parse(dateRange[1], "yyyy-MM-dd", new Date()))
          ? parse(dateRange[1], "yyyy-MM-dd", new Date())
          : null,
    };
  };

  const timeFilters = [
    {
      text: TIME_FILTERS.DAY,
      isActive: selectedTimeFilter === TIME_FILTERS.DAY,
      onClick: () => {
        setDateRange(TIME_FILTERS.DAY);
      },
    },
    {
      text: TIME_FILTERS.WEEK,
      isActive: selectedTimeFilter === TIME_FILTERS.WEEK,
      onClick: () => {
        setDateRange(TIME_FILTERS.WEEK);
      },
    },
    {
      text: TIME_FILTERS.MONTH,
      isActive: selectedTimeFilter === TIME_FILTERS.MONTH,
      onClick: () => {
        setDateRange(TIME_FILTERS.MONTH);
      },
    },
  ];

  const TimeFilterButton = ({ text, isActive, onClick }) => {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        size="sm"
        className={cn(buttonClassName, isActive && activeButtonClassName)}
      >
        {text}
      </Button>
    );
  };

  const handleCalendarSelect = (date) => {
    if (date) {
      const startOfWeek = date.from
        ? moment(date.from).format("YYYY-MM-DD")
        : null;
      const endOfWeek = date.to
        ? moment(date.to).format("YYYY-MM-DD")
        : null;

      setSelectedTimeFilter(`${startOfWeek},${endOfWeek}`);
      setDateRangeState(date);
      setDateRange(`${startOfWeek},${endOfWeek}`);
    }
  };

  const renderDateRangePicker = () => {
    const date = dateRange || { from: null, to: null };
    
    return (
      <div style={{ width: "fit-content" }}>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"ghost"}
              className={cn(
                buttonClassName,
                date && date?.from && activeButtonClassName
              )}
            >
              {date && date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span className="flex items-center">
                  <CalendarDays className="h-5 mr-1" /> DD MM YYYY - DD MM
                  YYYY
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from || new Date()}
              selected={date}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              disabled={false}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <CardContent className="w-auto p-1 bg-white rounded" style={{ width: "fit-content" }}>
      <div
        className="flex flex-wrap items-center self-stretch justify-between my-auto text-neutral-900"
        style={{ width: "fit-content" }}
      >
        {/* <ArrowLeft className="h-5" /> */}
        {timeFilters.map((filter, index) => (
          <TimeFilterButton
            key={index}
            text={filter.text}
            isActive={filter.isActive}
            onClick={filter.onClick}
          />
        ))}
        {renderDateRangePicker()}
        {/* <ArrowRight className="h-5" /> */}
      </div>
    </CardContent>
  );
});

export default DateRangeFilter;
