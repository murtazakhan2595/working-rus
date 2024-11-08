import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../../../../src/@/components/ui/dropdown-menu";
import { Button } from "../../../../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { dropdownOptions } from "data/Data";

const RenderJobApplicationActions = ({ row, handleOptionSelect }) => {
  console.log(row, "ROW")

  // Function to filter dropdown options based on the current status
  const getFilteredOptions = (status) => {
    switch (status) {
      case "shortlisted":
        return dropdownOptions.filter((option) =>
          ["schedule", "selected", "rejected"].includes(option.value)
        );
      case "pending":
        return [
          { label: "Review Application", value: "review" },
          ...dropdownOptions.filter((option) =>
            ["shortlisted", "rejected"].includes(option.value)
          ),
        ];
      case "rejected":
        return dropdownOptions.filter((option) =>
          ["send_email", "reconsider"].includes(option.value)
        );
      case "offer_made":
        return dropdownOptions.filter((option) =>
          ["offer_accepted", "declined"].includes(option.value)
        );
      default:
        return dropdownOptions.slice(0, 5); // Show first 5 options by default
    }
  };

  const filteredOptions = getFilteredOptions(row.application_status);

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
