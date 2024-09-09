import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../../../../../../src/@/components/ui/popover";
import { Button } from "../../../../../../components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../../../../../../src/@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

const StatusDropdown = [
  { label: "All Requests", value: "All Requests" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Denied", value: "Rejected" },
];


const RenderLeaveStatusDropdown = ({ status, setFilterOption }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(status);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? StatusDropdown.find((item) => item.value === value)?.label
            : "Select status..."}
          <ChevronsUpDown  className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {StatusDropdown?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setFilterOption(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === item.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RenderLeaveStatusDropdown;
