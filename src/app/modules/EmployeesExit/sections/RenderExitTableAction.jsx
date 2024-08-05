import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";



const RenderExitTableAction = ({ row,handleOptionSelect, reload }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const dispatch = useDispatch();

  const status = row.status_resignation;

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  
  const isMangerView= (status === "rejected by manager" || status === "pending" || status === "accepted by manager" )&&loggedInUser.role === 2;
  const isHrView =
    ((status === "rejected by hr" ||
      status === "pending" ||
      status === "accepted by hr" ||
      status === "accepted by manager") &&
      loggedInUser.role === 1) ||
    loggedInUser.role === 3;
  
  console.log(loggedInUser, status, isMangerView);
  return (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
      >
        <DropdownToggle className="border-0 shadow-none bg-transparent">
          <Link
            className="text-zinc-600 text-sm font-normal"
            style={{
              padding: ".35em .65em",
              fontSize: ".75em",
              minWidth: "100px",
            }}
            role={"button"}
          >
            <div className="flex items-center gap-[6px]">
              {status.includes("accepted by manager") ? (
                <FaRegCircle className="text-lime-600" />
              ) : status.includes("rejected by manager") ? (
                <FaRegCircle className="text-red-600" />
              ) : status.includes("accepted by hr") ? (
                <FaRegCircle className="text-green-600" />
              ) : status.includes("rejected by hr") ? (
                <FaRegCircle className="text-gray-600" />
              ) : (
                <FaRegCircle className="text-gray-600" />
              )}
              <div className="flex items-center capitalize">
                {status}
                <RiArrowDropDownLine className="text-xl text-zinc-600" />
              </div>
            </div>
          </Link>
        </DropdownToggle>
        <DropdownMenu start className="p-6">
          {isMangerView && (
            <>
              <DropdownItem
                onClick={() => handleOptionSelect(row, "accepted by manager")}
              >
                <div className={`p-2 flex gap-[6px] items-center`}>
                  <FaRegCircle className="text-lime-600" />
                  <div className="text-zinc-600 text-sm font-normal">
                    Accept
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => handleOptionSelect(row, "rejected by manager")}
              >
                <div className={`p-2 flex gap-[6px]`}>
                  <FaRegCircle className="text-red-600" />
                  <div className="text-zinc-600 text-sm font-normal">
                    Reject
                  </div>
                </div>
              </DropdownItem>
            </>
          )}
          {isHrView && (
            <>
              <DropdownItem
                onClick={() => handleOptionSelect(row, "accepted by hr")}
              >
                <div className={`p-2 flex gap-[6px] items-center`}>
                  <FaRegCircle className="text-green-600" />
                  <div className="text-zinc-600 text-sm font-normal">
                    Accept by HR
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => handleOptionSelect(row, "rejected by hr")}
              >
                <div className={`p-2 flex gap-[6px]`}>
                  <FaRegCircle className="text-gray-600" />
                  <div className="text-zinc-600 text-sm font-normal">
                    Reject by HR
                  </div>
                </div>
              </DropdownItem>
            </>
          )}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

export default RenderExitTableAction;
