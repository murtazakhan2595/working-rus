import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "src/@/components/ui/dropdown-menu"
import {Button} from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal  } from "lucide-react";

const EmployeeAttendenceHistoryActions = ({ row }) => {
  const navigate = useNavigate();
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
      <DropdownMenuItem onClick={() => navigate(`/attendance/${row.employee_id}`)}>View Details</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
   
  );
};

export default EmployeeAttendenceHistoryActions;
