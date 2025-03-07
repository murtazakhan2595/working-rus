import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { Button } from "src/@/components/ui/button";
import { Status } from "app/modules/ExitAndClearance/Sections";
import { StatusViewIcon, StatusLabel } from "components/StatusLabel";
import { TerminationStatus } from "utils/getValuesFromTables";

const TerminationStatusView = ({ status = "viewed by manager", row, buttonTitle = "View" }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-2";
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  const Message = (status) => {
    if (status === "Approved") return "Accepted";
    else if (status === "Rejected") return "Rejected";
    else return "Approval";
  };
  const employeeApproval = Status(status, 0);
console.log(status,'status123');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StatusLabel className="rounded cursor-pointer" status={status}>
          {TerminationStatus(status || "pending")}
        </StatusLabel>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3 ml-2 shadow">
        <DropdownMenuLabel className={`${itemClassName} fw-bold`}>
          <span>Termination Status</span>
        </DropdownMenuLabel>
        <DropdownMenuLabel className={`${itemClassName}`}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={"Approved"} /> Viewed by Manager
          </span>
        </DropdownMenuLabel>
        <DropdownMenuLabel className={`${itemClassName}`}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={employeeApproval} />
            {`${Message(employeeApproval)} by Employee`}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuLabel className={`${itemClassName}`}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={Status(status, 3)} />
            Clearance initiated
          </span>
        </DropdownMenuLabel>
        <DropdownMenuLabel className={`${itemClassName}`}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={Status(status, 4)} /> Exit Interview
          </span>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TerminationStatusView;
