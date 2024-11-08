import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../../../../src/@/components/ui/dropdown-menu"
import {Button} from "../../../../../components/ui/button";
import { MoreHorizontal  } from "lucide-react";
import { dropdownOptions } from "data/Data";

const RenderJobApplicationActions = ({ row, handleOptionSelect }) => {

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        aria-haspopup="true"
        size="icon"
        variant="ghost"
      >
        <MoreHorizontal className="w-4 h-4" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
     {dropdownOptions.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => handleOptionSelect(row, option.value)}>
            {option.label}
          </DropdownMenuItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
   
  );
};

export default RenderJobApplicationActions;
