import React, { useState, useEffect, forwardRef, memo } from "react";
// import Select from "react-select";
import { Label } from "src/@/components/ui/label";
import DatePicker from "react-datepicker";
import { cn } from "src/@/lib/utils";
import moment from "moment";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "src/@/components/ui/radio-group";
import TextInput from "components/FormControl/TextInput";
import NumberInput from "components/FormControl/NumberInput";
import PasswordInput from "components/FormControl/PasswordInput";
import CheckBoxInputTree from "components/FormControl/CheckBoxInputTree";
import CoverFileUpload from "components/FormControl/UploadFiles";
import { ChevronsUpDown, Check, SearchIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "src/@/components/ui/calendar";
import TextEditorInputField from "./TextEditorInputField";
import FilterInput from "./FilterInput";
import MonthInput from "./MonthInput";
import CommentsInputField from "./CommentsInputField";
import SwitchInput from "./SwitchInput";
import DateRangeFilter from "./DateRangeFilter";
import TextAreaInput from "./TextAreaInput";
import SortingFilters from "./SortingFilters";
import TimePicker from "./TimePicker";
import { InputSignature } from "./InputSignature";
import {
  SelectMultiInputComponent,
  SelectInputComponent,
} from "components/FormControl/InputSelect";
import ImageInput from "components/FormControl/UploadFiles/ImageInput";
import EmailInput from "components/FormControl/EmailInput";
import ColorInput from "./ColorInput";
import DateInput from "./DateInput";
import RadioGroupInput from "./RadioGroupInput";
import PhoneNumberInput from "./PhoneNumberInput";
import CheckBoxInput from "./CheckBoxInput";
import DateRangeInput from "./DateRangeInput";
import SelectLocationOnMap from "./SelectLocationOnMap";

const errorClassName = "text-red-800 text-xs font-[inter] font-normal ml-1";
export const inputButtonClassName =
  "inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-white text-primary hover:text-primary hover:bg-white hover:shadow-none h-fit px-4 py-2 flex-wrap justify-between w-full rounded-sm border-neutral-500";

export const InvalidInput = "border-red-800";
// General FormField Component
export const FormField = memo(
  forwardRef(
    (
      {
        name,
        label,
        required,
        error,
        touched,
        className = "w-full", // Custom styling
        disabled = false,
        field_description,
        label_description,
        children,
      },
      ref
    ) => {
      return (
        <div className={cn(`flex flex-col gap-4`, className)}>
          {label && (
            <div>
              <Label htmlFor={name} className="items-center flex">
                {required && <span className="text-red-600">* </span>}
                {label}
              </Label>
              {label_description && (
                <div
                  className={
                    "text-neutral-900 text-xs font-[inter] font-normal"
                  }
                >
                  {label_description}
                </div>
              )}
            </div>
          )}

          <div
            className={`flex-col flex gap-1 relative ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            {children}
            {field_description && (
              <div
                className={
                  "text-neutral-900 text-xs font-[inter] font-normal mt-1"
                }
              >
                {field_description}
              </div>
            )}
            {Boolean(error) && touched && (
              <div className={errorClassName}>{error}</div>
            )}
          </div>
        </div>
      );
    }
  )
);

export const FormPopoverButton = memo(
  forwardRef(
    (
      {
        popoverContent,
        triggerContent,
        className = "", // Allows additional styling
        open,
        setOpen,
        disabled = false,
        invalidField = false,
        popoverClassName,
      },
      ref
    ) => {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                inputButtonClassName,
                className,
                invalidField ? InvalidInput : ""
              )}
              disabled={disabled}
            >
              {triggerContent}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("min-w-[300px] w-auto p-0", popoverClassName)}
          >
            {popoverContent}
          </PopoverContent>
        </Popover>
      );
    }
  )
);

export const FormPlaceholder = memo(
  ({
    placeholder = "Enter Value",
    className = "", // Allows additional styling
  }) => {
    return (
      <div
        className={cn(
          "text-sm font-normal text-neutral-1000 max-w-[90%] overflow-hidden",
          className
        )}
      >
        {placeholder}
      </div>
    );
  }
);

export const FormFieldIcon = memo(
  ({
    icon = null,
    className = "", // Allows additional styling
  }) => {
    if (!icon) return null;
    return <div className={cn("w-4", className)}>{icon}</div>;
  }
);

export {
  CommentsInputField,
  TimePicker,
  SelectLocationOnMap,
  SelectMultiInputComponent,
  SelectInputComponent,
  DateInput,
  TextInput,
  PhoneNumberInput,
  EmailInput,
  ImageInput,
  TextAreaInput,
  FilterInput,
  CheckBoxInput,
  CheckBoxInputTree,
  PasswordInput,
  RadioGroupInput,
  NumberInput,
  CoverFileUpload,
  errorClassName,
  TextEditorInputField,
  SortingFilters,
  DateRangeFilter,
  ColorInput,
  DateRangeInput,
  InputSignature,
  MonthInput,
  SwitchInput,
};
