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
import { Status, getDecision, StatusIcon } from ".";
import { useParams, Link } from "react-router-dom";
import { updateLeaveStatus } from "app/hooks/leaveManagment";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";




const RenderAction = ({ row, reload }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const status = Status(row.status_hr);
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const updatedstatus = async(status) => {
      try {
      const payload = row;
      if (loggedInUser.role === 1 || loggedInUser.role === 3) {
        payload['status_hr'] = `${status} by HR`;
      }else if(loggedInUser.role===2){
        payload["status_manager"] = `${status} by Manager`;
      }
      const response = await updateLeaveStatus(payload, loggedInUser);
      if (response) {
        toast.success(`Application ${status} Successfully!`);
        reload();
      } else {
        toast.error(`Application Could not be ${status}"`);
      }
    } catch (error) {
      console.error("error",error)
      toast.error(`Application Could not be ${status}"`);
    }
  }
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
                <RiArrowDropDownLine className="text-xl text-zinc-600"/>
              </div>
            </div>
          </Link>
        </DropdownToggle>
        <DropdownMenu start className="p-6">
          <DropdownItem
            onClick={() => {
              updatedstatus("Approved");
            }}
          >
            <div className={`flex gap-[6px] items-center`}>
              <FaRegCircle className="text-lime-600 " />
              <div className="text-zinc-600 text-sm font-normal ">Accept</div>
            </div>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              updatedstatus("Declined");
            }}
          >
            <div className={`mt-6 flex gap-[6px]`}>
              <FaRegCircle className="text-red-600 " />
              <div className="text-zinc-600 text-sm font-normal ">Reject</div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default RenderAction;
