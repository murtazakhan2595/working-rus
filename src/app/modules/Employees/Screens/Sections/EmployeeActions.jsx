import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../../../../src/@/components/ui/dropdown-menu";
import { Button } from "../../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";
import { Check, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";

const EmployeeAction = ({ row }) => {
  const navigate = useNavigate();
  const userRole = useSelector((state) => state.user.userProfile.role);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const handleDelete = async (employeeId) => {
    try {
      await saveEmployeeWorkInformationData(employeeId, {
        employee_status: "Terminated",
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel>More Actions</DropdownMenuLabel> */}
        {(userRole === 1 || userRole === 3) && (
          <DropdownMenuItem onClick={() => navigate(`/profile/${row.id}`)}>
            Edit Profile
          </DropdownMenuItem>
        )}
        {/* {(userRole === 1 || userRole === 3) && ( */}
          <DropdownMenuItem
            onClick={() => navigate(`/edit-employee/${row.id}`)}
          >
            Edit Employee
          </DropdownMenuItem>
        {/* )} */}
        <DropdownMenuItem onClick={() => navigate(`/user/${row.id}`)}>
          View Profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmployeeAction;
