"use client";
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"

import { cn } from "../../../@/lib/utils"
import { buttonVariants } from "../../../../components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./select"

// Custom caption component with month and year dropdowns
function CustomCaption({ date, locale, displayMonth, onMonthSelect, onYearSelect, displayIndex = 0 }) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  
  // Ensure we have a valid date object
  const safeDate = date || displayMonth || new Date();
  
  // Generate arrays for months and years
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(i);
    return {
      value: i.toString(),
      label: month.toLocaleString(locale || 'default', { month: 'long' })
    };
  });

  // Generate array of years (from 1925 to current year + 10)
  const currentYear = new Date().getFullYear();
  const startYear = 1925;
  const endYear = currentYear + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return {
      value: year.toString(),
      label: year.toString()
    };
  });

  const handleMonthChange = (newMonth) => {
    const newDate = new Date(safeDate);
    newDate.setMonth(parseInt(newMonth));
    goToMonth(newDate);
    if (onMonthSelect) onMonthSelect(newDate, displayIndex);
  };

  const handleYearChange = (newYear) => {
    const newDate = new Date(safeDate);
    newDate.setFullYear(parseInt(newYear));
    goToMonth(newDate);
    if (onYearSelect) onYearSelect(newDate, displayIndex);
  };

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <Select 
        value={safeDate.getMonth().toString()} 
        onValueChange={handleMonthChange}
      >
        <SelectTrigger 
          className="h-8 w-[130px] text-sm font-medium border-neutral-300 focus:ring-plum-500 hover:bg-neutral-100 transition-colors"
          aria-label="Select month"
        >
          <SelectValue placeholder={safeDate.toLocaleString(locale || 'default', { month: 'long' })} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {months.map((month) => (
            <SelectItem 
              key={month.value} 
              value={month.value}
              className="text-sm cursor-pointer hover:bg-plum-100 hover:text-plum-900"
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={safeDate.getFullYear().toString()}
        onValueChange={handleYearChange}
      >
        <SelectTrigger 
          className="h-8 w-[80px] text-sm font-medium border-neutral-300 focus:ring-plum-500 hover:bg-neutral-100 transition-colors"
          aria-label="Select year"
        >
          <SelectValue placeholder={safeDate.getFullYear().toString()} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {years.map((year) => (
            <SelectItem 
              key={year.value} 
              value={year.value}
              className="text-sm cursor-pointer hover:bg-plum-100 hover:text-plum-900"
            >
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  month,
  defaultMonth = new Date(),
  mode = "single",
  selected,
  numberOfMonths = 1,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(month || defaultMonth);

  // Update current month when month prop changes
  React.useEffect(() => {
    if (month) {
      setCurrentMonth(month);
    }
  }, [month]);

  // Handle month change from the CustomCaption component
  const handleMonthChange = (date, displayIndex = 0) => {
    let newDate;
    if (mode === "range" && numberOfMonths > 1) {
      // For range mode with multiple months, adjust the date based on display index
      newDate = new Date(date);
      if (displayIndex === 1) {
        // For the second calendar, ensure it stays one month ahead
        const firstMonth = new Date(currentMonth);
        if (newDate <= firstMonth) {
          newDate = new Date(firstMonth);
          newDate.setMonth(newDate.getMonth() + 1);
        }
      } else {
        // For the first calendar, ensure it stays one month behind
        const secondMonth = new Date(date);
        secondMonth.setMonth(secondMonth.getMonth() + 1);
        if (displayIndex === 0 && date >= secondMonth) {
          newDate = new Date(secondMonth);
          newDate.setMonth(newDate.getMonth() - 1);
        }
      }
    } else {
      newDate = date;
    }
    
    setCurrentMonth(newDate);
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
  };

  // Customize the caption component based on the mode
  const renderCaption = ({ displayMonth, ...captionProps }) => {
    return (
      <CustomCaption 
        displayMonth={displayMonth || currentMonth}
        onMonthSelect={handleMonthChange}
        displayIndex={captionProps.displayIndex}
        {...captionProps} 
      />
    );
  };

  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={currentMonth}
      defaultMonth={defaultMonth}
      mode={mode}
      selected={selected}
      numberOfMonths={numberOfMonths}
      classNames={{
        months: cn(
          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          numberOfMonths > 1 && "w-full"
        ),
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "hidden", // Hide the default caption label
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-center",
        head_cell:
          "text-mauve-900 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400",
        row: "flex w-full mt-2 justify-center",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-slate-300 text-slate-50 hover:bg-slate-900 hover:text-slate-50  focus:bg-slate-900 focus:text-white dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900",
        day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        day_outside:
          "day-outside text-slate-800 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400",
        day_disabled: "text-slate-500 dark:text-slate-400",
        day_range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="w-4 h-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="w-4 h-4" />,
        Caption: renderCaption,
      }}
      onMonthChange={handleMonthChange}
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
