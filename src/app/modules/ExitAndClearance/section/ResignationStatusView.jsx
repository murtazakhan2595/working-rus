import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { StatusViewIcon } from "components";
import { Status } from "./index";

const ResignationStatusView = ({ row,}) => {
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
  const managerApproval = Status(row.status_resignation, 1);
  const HRApproval = Status(row.status_resignation, 2);

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
              fontSize: ".75em",
              minWidth: "100px",
            }}
          >
            View
          </button>
        </DropdownToggle>
        <DropdownMenu start className="p-3 ml-2 shadow ">
          <DropdownItem className={`${itemClassName} fw-bold`}>
            <span>Application Status</span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={"Approved"} /> Application Submitted
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={managerApproval} />
              {`${Message(managerApproval)} by Manager`}
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={HRApproval} />
              {`${Message(HRApproval)} by HR`}
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={Status(row.status_resignation, 3)} />
              Clearance initiated
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusViewIcon status={Status(row.status_resignation, 4)} /> Exit
              Interview
            </span>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default ResignationStatusView;
