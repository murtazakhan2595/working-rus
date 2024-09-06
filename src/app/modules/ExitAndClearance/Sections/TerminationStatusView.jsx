import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Status } from "./index";
import { StatusViewIcon } from "components/StatusLabel";

const TerminationStatusView = ({ row, buttonTitle = "View" }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-2";
  const status = row.status_termination || "pending";
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  const Message = (status) => {
    if (status === "Approved") return "Accepted";
    else if (status === "Rejected") return "Rejected";
    else return "Approval";
  };
  const employeeApproval = Status(status, 0);

  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
      >
        <DropdownToggle className="border-0 shadow-none bg-transparent p-0">
          <button
            className="btn btn-outline-dark bg-white text-dark shadow-none"
            style={{
              padding: ".35em .65em",
              fontSize: ".94em",
              minWidth: "100px",
              height: "35px",
              width: "auto",
            }}
          >
            {buttonTitle}
          </button>
        </DropdownToggle>
        <DropdownMenu start className="p-3 ml-2 shadow ">
          <DropdownItem className={`${itemClassName} fw-bold`}>
            <span>Termination Status</span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={"Approved"} /> Viewed by Manager
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={employeeApproval} />
              {`${Message(employeeApproval)} by Employee`}
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={Status(status, 3)} />
              Clearance initiated
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={Status(status, 4)} /> Exit Interview
            </span>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default TerminationStatusView;
