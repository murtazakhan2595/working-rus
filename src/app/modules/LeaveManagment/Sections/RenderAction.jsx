import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Status, UpdateStatus } from ".";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";

const RenderLeaveAction = ({ row, reload }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const status = Status(row.status_hr);
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const updatedstatus = async (status) => {
    const response = UpdateStatus(status, row, loggedInUser);
    if (response) {
      reload();
    }
  };
  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
      >
        <DropdownToggle className="border-0 shadow-none bg-transparent">
          <Link
            className="text-zinc-600 text-sm font-normal "
            style={{
              padding: ".35em .65em",
              fontSize: ".75em",
              minWidth: "100px",
            }}
            role={"button"}
          >
            <div className="flex items-center gap-[6px]">
              {status === "Approved" ? (
                <FaRegCircle className="text-lime-600 " />
              ) : status === "Pending" ? (
                <FaRegCircle className="text-gray-600 " />
              ) : (
                <FaRegCircle className="text-red-600 " />
              )}
              <div className="flex items-center">
                {status}
                <RiArrowDropDownLine className="text-xl text-zinc-600" />
              </div>
            </div>
          </Link>
        </DropdownToggle>
        <DropdownMenu start className="p-6">
          {status !== "Approved" && (
            <DropdownItem
              onClick={() => {
                updatedstatus("Approved");
              }}
            >
              <div className={`p-2 flex gap-[6px] items-center`}>
                <FaRegCircle className="text-lime-600 " />
                <div className="text-zinc-600 text-sm font-normal ">Accept</div>
              </div>
            </DropdownItem>
          )}
          {status !== "Rejected" && (
            <DropdownItem
              onClick={() => {
                updatedstatus("Declined");
              }}
            >
              <div className={`p-2 flex gap-[6px]`}>
                <FaRegCircle className="text-red-600 " />
                <div className="text-zinc-600 text-sm font-normal ">Reject</div>
              </div>
            </DropdownItem>
          )}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default RenderLeaveAction;
