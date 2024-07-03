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
import { useParams, Link } from "react-router-dom";

const RenderStatus = ({ row }) => {
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
          <Link
            className="btn btn-outline-dark bg-white text-dark shadow-none"
            style={{
              padding: ".35em .65em",
              fontSize: ".75em",
              minWidth: "100px",
            }}
            role={"button"}
          >
            View
          </Link>
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
              <StatusIcon status={row.status_manager} />
              Direct Manager Approval
            </span>
          </DropdownItem>
          {row.status_indirect_manager && (
            <DropdownItem className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={row.status_indirect_manager} />
                In-Direct Manager Approval
              </span>
            </DropdownItem>
          )}
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
