import React, { useState } from "react";

import { Status } from 'app/modules/ExitAndClearance/Sections'
import { StatusViewIcon, StatusLabel } from "components/StatusLabel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { ResignationStatus } from "utils/getValuesFromTables";

const ResignationStatusView = ({ status}) => {
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
  const managerApproval = Status(status, 1);
  const HRApproval = Status(status, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <StatusLabel className="rounded cursor-pointer" status={status}>
          {ResignationStatus(status)}
        </StatusLabel>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3 ml-2 shadow">
        <DropdownMenuLabel className={`${itemClassName} fw-bold`}>
          <span>Application Status</span>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={"Approved"} /> Application Submitted
          </span>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={managerApproval} />
            {`${Message(managerApproval)} by Manager`}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={HRApproval} />
            {`${Message(HRApproval)} by HR`}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={Status(status, 3)} />
            Clearance initiated
          </span>
        </DropdownMenuLabel>

        <DropdownMenuLabel className={`${itemClassName} `}>
          <span className={`${spanClassName}`}>
            <StatusViewIcon status={Status(status, 4)} /> Exit
            Interview
          </span>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResignationStatusView;
