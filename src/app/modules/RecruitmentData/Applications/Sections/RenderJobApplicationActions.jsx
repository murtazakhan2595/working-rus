import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../../../../src/@/components/ui/dropdown-menu";
import { Button } from "../../../../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { dropdownOptions } from "data/Data";

const RenderJobApplicationActions = ({ row, handleOptionSelect }) => {

  // Function to filter dropdown options based on the current status
  const getFilteredOptions = (status) => {
    switch (status) {
      case "shortlisted":
        return dropdownOptions.filter((option) =>
          ["interview r1", "rejected"].includes(option.value)
        );
      case "pending":
        return [
          // { label: "Review Application", value: "review" },
          ...dropdownOptions.filter((option) =>
            ["review application", "rejected"].includes(option.value)
          ),
        ];
        case "review application":
          return dropdownOptions.filter((option) =>
            ["shortlisted", "interview r1", "rejected"].includes(option.value)
          );
      case "rejected":
        return dropdownOptions.filter((option) =>
          ["reconsider"].includes(option.value)
        );
      case "selection":
        return dropdownOptions.filter((option) =>
          ["offer_made", "declined", "rejected"].includes(option.value)
        );
      case "interview r1":
        return dropdownOptions.filter((option)=>
        ["interview r2", "selected", "rejected"].includes(option.value))
        case "interview r2":
          return dropdownOptions.filter((option)=>
          ["selected", "rejected"].includes(option.value))
      default:
        return dropdownOptions.slice(0, 5); // Show first 5 options by default
    }
  };

  const filteredOptions = getFilteredOptions(row?.application_status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filteredOptions.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => handleOptionSelect(row, option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RenderJobApplicationActions;
