import React, { useState } from "react";
import {
  StatusViewIcon,
  StatusLabel,
  getStatusVariant,
} from "components/StatusLabel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "src/@/components/ui/dropdown-menu";
import { EmployeeTransferStatus } from "data/Data";

const EmployeeTransferStatusView = ({ status = "PENDING" }) => {
  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-0 px-0";
  const Status =
    EmployeeTransferStatus.find((obj) => obj.value === status)?.label || status;

  const ManagerApproval =
    status === "ACCEPTED BY MANAGER"
      ? "Approved"
      : status === "ACCEPTED BY MANAGER"
      ? "REJECTED"
      : "pending";

  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StatusLabel className="rounded cursor-pointer" status={status}>
          {Status}
        </StatusLabel>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3 ml-2 shadow">
        <DropdownMenuLabel className={`${itemClassName} fw-bold`}>
          <span>Application Status</span>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <StatusLabel variant={"ghost"} status={"success"} iconVariant={true}>
            Submitted
          </StatusLabel>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <StatusLabel variant={"ghost"} status={ManagerApproval} iconVariant={true}>
            Manager Approval
          </StatusLabel>
        </DropdownMenuLabel>
        <DropdownMenuLabel className={`${itemClassName} `}>
          <StatusLabel variant={"ghost"} status={status} iconVariant={true}>
            HR Approval
          </StatusLabel>
        </DropdownMenuLabel>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmployeeTransferStatusView;
