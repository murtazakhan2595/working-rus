import React from "react";
import { cn } from "src/@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { Calendar } from "src/@/components/ui/calendar";

const DateRangePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date range",
  disabled = false,
}) => {
  // Parse initial value if it's a string
  const parseInitialValue = () => {
    if (!value) return null;
    if (typeof value === "string") {
      const [fromStr, toStr] = value.split(",");
      return {
        from: new Date(fromStr),
        to: new Date(toStr),
      };
    }
    return value;
  };

  const [date, setDate] = React.useState(parseInitialValue());

  const handleSelect = (range) => {
    setDate(range);
    if (onChange && range?.from && range?.to) {
      // Format as YYYY-MM-DD,YYYY-MM-DD
      const formattedRange = `${moment(range.from).format(
        "YYYY-MM-DD"
      )},${moment(range.to).format("YYYY-MM-DD")}`;
      onChange(formattedRange);
    } else if (onChange) {
      onChange("");
    }
  };

  const formatDisplayDate = (date) => {
    return moment(date).format("MMM DD, YYYY");
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {formatDisplayDate(date.from)} - {formatDisplayDate(date.to)}
                </>
              ) : (
                formatDisplayDate(date.from)
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            className="border rounded-md"
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
              ),
              day: cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected:
                "bg-plum-400 text-slate-50 hover:bg-plum-400 hover:text-slate-50 focus:bg-plum-400 focus:text-slate-50",
              day_today: "bg-slate-100 text-slate-900",
              day_outside: "text-slate-500 opacity-50",
              day_disabled: "text-slate-500 opacity-50",
              day_range_middle:
                "aria-selected:bg-slate-100 aria-selected:text-slate-900",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
