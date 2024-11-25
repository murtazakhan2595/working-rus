import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { cn } from "../../src/@/lib/utils"
import { Button } from "./button"
import { Calendar } from "../../src/@/components/ui/calendar"
import { Label } from "../../src/@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../src/@/components/ui/popover"
import { Input } from "./input"
import { PatternFormat } from "react-number-format"

const DateTimePicker = React.forwardRef(({ 
  name,
  value,
  error,
  touch,
  onChange = () => {},
  label,
  disabled,
  required,
  className,
  placeholder,
  hourCycle = 24,
  granularity = "second",
}, ref) => {
  const [date, setDate] = React.useState(
    value && isValid(parse(value, "yyyy-MM-dd HH:mm:ss", new Date())) 
      ? parse(value, "yyyy-MM-dd HH:mm:ss", new Date()) 
      : null
  );
  
  const [inputValue, setInputValue] = React.useState(
    value && isValid(parse(value, "yyyy-MM-dd HH:mm:ss", new Date())) 
      ? format(parse(value, "yyyy-MM-dd HH:mm:ss", new Date()), "dd/MM/yyyy") 
      : ""
  );

  const [timeValue, setTimeValue] = React.useState({
    hour: date ? format(date, "HH") : "",
    minute: date ? format(date, "mm") : "",
    second: date ? format(date, "ss") : ""
  });

  const [calendarDate, setCalendarDate] = React.useState(date || new Date());

  React.useEffect(() => {
    if (value) {
      const parsedDate = parse(value, "yyyy-MM-dd HH:mm:ss", new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setInputValue(format(parsedDate, "dd/MM/yyyy"));
        setCalendarDate(parsedDate);
        setTimeValue({
          hour: format(parsedDate, "HH"),
          minute: format(parsedDate, "mm"),
          second: format(parsedDate, "ss")
        });
      } else {
        resetFields();
      }
    } else {
      resetFields();
    }
  }, [value]);

  const resetFields = () => {
    setDate(null);
    setInputValue("");
    setCalendarDate(new Date());
    setTimeValue({ hour: "", minute: "", second: "" });
    onChange(name, "");
  };

  const handleInputChange = (values) => {
    const { formattedValue } = values;
    setInputValue(formattedValue);

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (dateRegex.test(formattedValue)) {
      const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate)) {
        const newDate = new Date(parsedDate);
        if (timeValue.hour) newDate.setHours(parseInt(timeValue.hour));
        if (timeValue.minute) newDate.setMinutes(parseInt(timeValue.minute));
        if (timeValue.second) newDate.setSeconds(parseInt(timeValue.second));
        
        setDate(newDate);
        setCalendarDate(newDate);
        updateFormValue(newDate);
      }
    }
  };

  const handleTimeChange = (value, type) => {
    const numValue = parseInt(value);
    let isValid = false;

    switch (type) {
      case 'hour':
        isValid = !isNaN(numValue) && numValue >= 0 && numValue < (hourCycle === 24 ? 24 : 12);
        break;
      case 'minute':
      case 'second':
        isValid = !isNaN(numValue) && numValue >= 0 && numValue < 60;
        break;
    }

    if (isValid || value === "") {
      const newTimeValue = { ...timeValue, [type]: value };
      setTimeValue(newTimeValue);

      if (date && value !== "") {
        const newDate = new Date(date);
        newDate.setHours(parseInt(newTimeValue.hour) || 0);
        newDate.setMinutes(parseInt(newTimeValue.minute) || 0);
        newDate.setSeconds(parseInt(newTimeValue.second) || 0);
        
        setDate(newDate);
        updateFormValue(newDate);
      }
    }
  };

  const handleCalendarSelect = (selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (timeValue.hour) newDate.setHours(parseInt(timeValue.hour));
      if (timeValue.minute) newDate.setMinutes(parseInt(timeValue.minute));
      if (timeValue.second) newDate.setSeconds(parseInt(timeValue.second));

      setDate(newDate);
      setInputValue(format(newDate, "dd/MM/yyyy"));
      setCalendarDate(newDate);
      updateFormValue(newDate);
    }
  };

  const updateFormValue = (date) => {
    onChange(name, format(date, "yyyy-MM-dd HH:mm:ss"));
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {label && (
        <Label htmlFor={name}>
          {required && <span className="text-red-600">* </span>} {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal rounded-sm h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {date ? (
              format(date, "d MMMM yyyy HH:mm:ss")
            ) : (
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <div className="text-sm font-normal text-neutral-600">
                  {placeholder || "Pick date and time"}
                </div>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col p-2 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <PatternFormat
                format="##/##/####"
                placeholder="DD/MM/YYYY"
                value={inputValue}
                onValueChange={handleInputChange}
                customInput={Input}
                className="w-[240px] text-center mx-auto text-sm font-normal text-neutral-1000"
              />
            </div>
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleCalendarSelect}
              month={calendarDate}
              onMonthChange={setCalendarDate}
              initialFocus
              disabled={disabled}
            />
            <div className="flex items-center justify-center gap-2 pt-2 border-t">
              {granularity !== "day" && (
                <PatternFormat
                  format="##"
                  placeholder="HH"
                  value={timeValue.hour}
                  onValueChange={(v) => handleTimeChange(v.formattedValue, "hour")}
                  customInput={Input}
                  className="w-[70px] text-center text-sm font-normal text-neutral-1000"
                />
              )}
              <span className="text-neutral-1100">:</span>
              {granularity !== "hour" && (
                <PatternFormat
                  format="##"
                  placeholder="MM"
                  value={timeValue.minute}
                  onValueChange={(v) => handleTimeChange(v.formattedValue, "minute")}
                  customInput={Input}
                  className="w-[70px] text-center text-sm font-normal text-neutral-1000"
                />
              )}
              {granularity === "second" && (
                <>
                  <span className="text-neutral-1100">:</span>
                  <PatternFormat
                    format="##"
                    placeholder="SS"
                    value={timeValue.second}
                    onValueChange={(v) => handleTimeChange(v.formattedValue, "second")}
                    customInput={Input}
                    className="w-[70px] text-center text-sm font-normal text-neutral-1000"
                  />
                </>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
})

DateTimePicker.displayName = "DateTimePicker"

export { DateTimePicker } 