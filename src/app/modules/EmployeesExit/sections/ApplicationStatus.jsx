import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { StatusIcon } from "app/modules/LeaveManagment/Sections";

const ApplicationStatus = ({ row, isTableViewButton=false }) => {
  const status = row.status_resignation;
  const [openDropdownRow, setOpenDropdownRow] = useState(null);

  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-2";

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const statusSteps = [
    { text: "Application Submitted", status: "Approved" },
    { text: "Accepted by Manager", status: "Approved" },
    { text: "Clearance initiated", status: "Approved" },
    { text: "Exit Interview", status: "Approved" },
    { text: "Accepted by HR", status: "Approved" },
  ];

  const getStatusIcon = (stepIndex) => {
    if (status === "pending") {
      return stepIndex === 0 ? "Approved" : "Pending";
    } else if (status === "accepted by manager") {
      return stepIndex <= 1 ? "Approved" : "Pending";
    } else if (status === "initiated clearance") {
      return stepIndex <= 2 ? "Approved" : "Pending";
    } else if (status === "exit interview") {
      return stepIndex <= 3 ? "Approved" : "Pending";
    } else if (status === "accepted by hr") {
      return stepIndex <= 4 ? "Approved" : "Pending";
    } else if(status === "rejected by manager") {
      return stepIndex < 1
        ? "Approved"
        : stepIndex === 1
        ? "Declined"
        : "Pending";
    }
    else if(status === "rejected by hr") {
      return stepIndex < 4
      ? "Approved"
      : stepIndex === 4
      ? "Declined"
      : "Pending";
    }
    return "Pending";
  };

  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
      >
        <DropdownToggle className="border-0 shadow-none bg-transparent p-0">
          {isTableViewButton ?<button className="h-[35px] px-[34px] py-2.5 rounded-[5px] border border-[#323233] justify-center items-center gap-2.5 inline-flex">
            <div className="text-[#323233] text-[15px] font-normal font-['Lato'] leading-[19px]">
              View
            </div>
          </button>:
          <button className="px-[34px] py-2.5 rounded-[5px] border border-[#323233] justify-center items-center gap-2.5 flex">
            <div className="text-[#323233] text-[15px] font-normal ">
              View status
            </div>
          </button>}
        </DropdownToggle>
        <DropdownMenu start className="p-3 ml-2 shadow ">
          <DropdownItem className={`${itemClassName} fw-bold`}>
            <span>Your Application Status</span>
          </DropdownItem>
          {statusSteps.map((step, index) => (
            <DropdownItem key={index} className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={getStatusIcon(index)} /> {step.text}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default ApplicationStatus;
