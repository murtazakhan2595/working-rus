import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { StatusIcon } from "app/modules/LeaveManagment/Sections";

const ApplicationStatus = ({ row, isTableViewButton=false }) => {
  console.log("row", row);
  const status = row.exit_category==="resignation"? row.status_resignation
    : row.status_termination;
  const [openDropdownRow, setOpenDropdownRow] = useState(null);

  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-2";

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const statusStepsResignation = [
    { text: "Application Submitted", status: "Approved" },
    { text: "Accepted by Manager", status: "Approved" },
    { text: "Clearance initiated", status: "Approved" },
    { text: "Exit Interview", status: "Approved" },
    { text: "Accepted by HR", status: "Approved" },
  ];
  const statusStepsTermination = [
    { text: "Application Submitted", status: "Approved" },
    { text: "Viewed by manager", status: "Approved" },
    { text: "Accepted by Employee", status: "Approved" },
  ];

  const getStatusIconResignation = (stepIndex) => {
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
  const getStatusIconTermination = (stepIndex) => {
    if (status === "") {
      return stepIndex === 0 ? "Approved" : "Pending";
    } else if (status === "accepted by manager") {
      return stepIndex <= 1 ? "Approved" : "Pending";
    } else if (status === "accepted by employee") {
      return stepIndex <= 2 ? "Approved" : "Pending";
    } 
     else if(status === "rejected by employee") {
      return stepIndex < 3
        ? "Approved"
        : stepIndex === 3
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
          {isTableViewButton ? (
            <button className="h-[35px] px-[34px] py-2.5 rounded-[5px] border border-[#323233] justify-center items-center gap-2.5 inline-flex">
              <div className="text-[#323233] text-[15px] font-normal font-['Lato'] leading-[19px]">
                View
              </div>
            </button>
          ) : (
            <button className="px-[34px] py-2.5 rounded-[5px] border border-[#323233] justify-center items-center gap-2.5 flex">
              <div className="text-[#323233] text-[15px] font-normal ">
                View status
              </div>
            </button>
          )}
        </DropdownToggle>
        <DropdownMenu start className="p-3 ml-2 shadow ">
          <DropdownItem className={`${itemClassName} fw-bold`}>
            <span>Your Application Status</span>
          </DropdownItem>
          {row.exit_category === "resignation" &&
            statusStepsResignation.map((step, index) => (
              <DropdownItem key={index} className={`${itemClassName}`}>
                <span className={`${spanClassName}`}>
                  <StatusIcon status={getStatusIconResignation(index)} />{" "}
                  {step.text}
                </span>
              </DropdownItem>
            ))}
          {row.exit_category === "termination" &&
            statusStepsTermination.map((step, index) => (
              <DropdownItem key={index} className={`${itemClassName}`}>
                <span className={`${spanClassName}`}>
                  <StatusIcon status={getStatusIconTermination(index)} />{" "}
                  {step.text}
                </span>
              </DropdownItem>
            ))}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default ApplicationStatus;
