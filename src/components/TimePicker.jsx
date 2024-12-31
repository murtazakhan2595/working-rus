import React, { useState } from 'react';
import { cn } from 'src/@/lib/utils'; // Import your `cn` utility if available
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "src/@/components/ui/dropdown-menu";

const TimePicker = ({ value = "12:00 AM", onChange, className }) => {
  const [time, setTime] = useState(value);

  const handleTimeChange = (newTime) => {
    setTime(newTime);
    if (onChange) {
      onChange(newTime);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const periods = ["AM", "PM"];

  // Ensure the time is split correctly (e.g., "12:00 AM")
  const [selectedHour, selectedMinute, selectedPeriod] = time.split(/[: ]/);
  
  // Default the split value to something valid if it's not in the correct format
  const hour = selectedHour || "12";
  const minute = selectedMinute || "00";
  const period = selectedPeriod || "AM";

  const validateHour = (value) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 1 || numericValue > 12) {
      return "12";
    }
    return String(numericValue).padStart(2, "0");
  };

  const validateMinute = (value) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 59) {
      return "00";
    }
    return String(numericValue).padStart(2, "0");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("px-4 py-2 border rounded-md cursor-pointer", className)}>
        {`${hour}:${minute} ${period}`}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex gap-2 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Hours</span>
          <input
            type="number"
            min="1"
            max="12"
            value={hour}
            onChange={(e) =>
              handleTimeChange(`${validateHour(e.target.value)}:${minute} ${period}`)
            }
            className="border rounded-md p-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Minutes</span>
          <input
            type="number"
            min="0"
            max="59"
            value={minute}
            onChange={(e) =>
              handleTimeChange(`${hour}:${validateMinute(e.target.value)} ${period}`)
            }
            className="border rounded-md p-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Period</span>
          {periods.map((periodItem) => (
            <DropdownMenuItem
              key={periodItem}
              className={cn("cursor-pointer", { "font-bold": periodItem === period })}
              onClick={() => handleTimeChange(`${hour}:${minute} ${periodItem}`)}
            >
              {periodItem}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TimePicker;
