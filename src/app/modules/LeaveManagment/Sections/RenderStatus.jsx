import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { StatusLabel } from "components";
import { Status, getDecision, StatusIcon } from "../Sections";

const RenderStatus = ({row}) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const status = Status(row.status_hr);
  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-2";
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
      >
        <DropdownToggle className="border-0 shadow-none bg-transparent">
          <StatusLabel status={status} />
        </DropdownToggle>
        <DropdownMenu start className="p-3 ml-2">
          <DropdownItem className={`${itemClassName} fw-bold`}>
            <span> Your Application Status</span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusIcon status={"Approved"} /> Viewed
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusIcon status={row.status_indirect_manager} />
              Direct Manager Approval
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusIcon status={row.status_hr} />
              In-Direct Manager Approval
            </span>
          </DropdownItem>
          <DropdownItem className={`${itemClassName}`}>
            <span className={`${spanClassName}`}>
              <StatusIcon status={row.status_hr} />
              {getDecision(status)}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default RenderStatus;
