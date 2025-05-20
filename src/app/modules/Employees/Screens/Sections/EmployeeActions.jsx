import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { HasAccess } from "utils/PermissionUtils";

const EmployeeAction = ({ row }) => {
  const ViewEmployeesDetailsPermitted = HasAccess("VIEW_EMPLOYEE_DETAILS");
  const EditEmployeesPermitted = HasAccess("EDIT_EMPLOYEE");
  const EditEmployeesDetailsPermitted = HasAccess("EDIT_EMPLOYEE_PROFILE");
  const navigate = useNavigate();
  if (
    !ViewEmployeesDetailsPermitted &&
    !EditEmployeesDetailsPermitted &&
    !EditEmployeesPermitted
  )
    return null;
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
        {EditEmployeesDetailsPermitted && (
          <DropdownMenuItem onClick={() => navigate(`/profile/${row.id}`)}>
            Edit Profile
          </DropdownMenuItem>
        )}
        {EditEmployeesPermitted && (
          <DropdownMenuItem
            onClick={() => navigate(`/edit-employee/${row.id}`)}
          >
            Edit Employee
          </DropdownMenuItem>
        )}
        {ViewEmployeesDetailsPermitted && (
          <DropdownMenuItem onClick={() => navigate(`/user/${row.id}`)}>
            View Profile
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmployeeAction;
