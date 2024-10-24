import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../../../src/@/components/ui/dropdown-menu";
import { Button } from "../../../../src/@/components/ui/button";
import { StatusIcon } from "components/StatusLabel";

const ApplicationStatus = ({ row, isTableViewButton = false }) => {
  const status =
    row.exit_category === "resignation"
      ? row.status_resignation
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
    } else if (status === "rejected by manager") {
      return stepIndex < 1
        ? "Approved"
        : stepIndex === 1
        ? "Declined"
        : "Pending";
    } else if (status === "rejected by hr") {
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
    } else if (status === "rejected by employee") {
      return stepIndex < 3
        ? "Approved"
        : stepIndex === 3
        ? "Declined"
        : "Pending";
    }
    return "Pending";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" variant="outline" className="">
          {isTableViewButton ? "View" : "View status"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className={`${itemClassName} fw-bold`}>
          Your Application Status
        </DropdownMenuLabel>
        {row.exit_category === "resignation" &&
          statusStepsResignation.map((step, index) => (
            <DropdownMenuItem key={index} className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={getStatusIconResignation(index)} />{" "}
                {step.text}
              </span>
            </DropdownMenuItem>
          ))}
        {row.exit_category === "termination" &&
          statusStepsTermination.map((step, index) => (
            <DropdownMenuItem key={index} className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={getStatusIconTermination(index)} />{" "}
                {step.text}
              </span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApplicationStatus;
