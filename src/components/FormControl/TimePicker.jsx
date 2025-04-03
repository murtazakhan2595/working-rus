import React, { useState } from "react";
import { cn } from "src/@/lib/utils"; // Import your `cn` utility if available
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { FormField } from "components/FormControl";
import moment from "moment";

const TimePicker = ({
  name = null,
  label = null,
  required = true,
  error = null,
  touch = null,
  disabled = false,
  value = null,
  date = null,
  onChange,
  className,
}) => {
  const initialDateTime = value
    ? moment(value).toISOString()
    : moment(date || new Date()).toISOString();

  const [time, setTime] = useState(initialDateTime);

  const handleTimeChange = (newHour, newMinute, newPeriod) => {
    const updatedTime = moment(time)
      .hour(newPeriod === "PM" ? parseInt(newHour, 10) + 12 : newHour)
      .minute(newMinute)
      .second(0)
      .toISOString();
    setTime(updatedTime);
    if (onChange) {
      onChange(name, updatedTime);
    }
  };

  const currentMoment = moment(time);
  const hour = currentMoment.format("hh");
  const minute = currentMoment.format("mm");
  const period = currentMoment.format("A");
  console.log()
  return (
    <>
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
        disabled={disabled}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "px-4 py-2 border rounded-md cursor-pointer",
              className
            )}
          >
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
                  handleTimeChange(e.target.value, minute, period)
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
                  handleTimeChange(hour, e.target.value, period)
                }
                className="border rounded-md p-1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Period</span>
              {["AM", "PM"].map((periodItem) => (
                <DropdownMenuItem
                  key={periodItem}
                  className={cn("cursor-pointer", {
                    "font-bold": periodItem === period,
                  })}
                  onClick={() => handleTimeChange(hour, minute, periodItem)}
                >
                  {periodItem}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </FormField>
    </>
  );
};

export default TimePicker;
