import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { cn } from "src/@/lib/utils";
import { CardContent } from "components/ui/card";
import { DateRangeInput } from 'components/FormControl';

const TIME_FILTERS = {
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
};

const buttonClassName = "px-2 py-0 h-full text-sm font-medium leading-tight rounded border-none";
const activeButtonClassName = "bg-fuchsia-50 text-fuchsia-700";

const DateRangeFilter = React.memo(({ setDateRange = () => { }, activeDateRange = "Week" }) => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(null);
  const [dateRange, setDateRangeState] = useState(null);

  useEffect(() => {
    setDateRangeState(null)
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
        setDateRangeState(activeDateRange);
      }
    }
  }, [activeDateRange]);


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

  const renderDateRangePicker = () => {
    return (
      <DateRangeInput
        placeholder={'DD MM YYYY - DD MM YYYY'}
        className={`rounded-sm text-neutral-1000`}
        inputStyle={buttonClassName}
        name={'date-range-filter'}
        value={dateRange || ""}
        onChange={(_, value) => {
          setSelectedTimeFilter(value);
          setDateRangeState(value);
          setDateRange(value);
        }}
      />
    );
  };

  return (
    <CardContent className="w-fit p-1 bg-white rounded border rounded-sm h-full flex flex-wrap items-center self-stretch justify-between my-auto text-neutral-900 gap-1">
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
    </CardContent>
  );
});

export default DateRangeFilter;
