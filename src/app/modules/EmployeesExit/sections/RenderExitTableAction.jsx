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

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaRegCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";

const RenderExitTableAction = ({
  row,
  handleOptionSelect,
  reload,
  isTableStyle,
}) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const dispatch = useDispatch();

  const status = row.status_resignation;

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const isMangerView =
    (status === "rejected by manager" ||
      status === "pending" ||
      status === "accepted by manager") &&
    loggedInUser.role === 2;
  const isHrView =
    ((status === "rejected by hr" ||
      status === "pending" ||
      status === "accepted by hr" ||
      status === "accepted by manager") &&
      loggedInUser.role === 1) ||
    loggedInUser.role === 3;

  return (
    <DropdownMenu
      isOpen={openDropdownRow === row.id}
      toggle={() => toggleDropdown(row.id)}
    >
      <DropdownMenuTrigger asChild>
        <Button className="text-zinc-600 text-sm font-normal" variant="outline">
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent start className="p-2">
        {isMangerView && (
          <>
            <DropdownMenuLabel
              onClick={() => handleOptionSelect(row, "accepted by manager")}
            >
              <div className={`flex gap-[6px] items-center`}>
                <FaRegCircle className="text-lime-600" />
                <div className="text-zinc-600 text-sm font-normal">Accept</div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel
              onClick={() => handleOptionSelect(row, "rejected by manager")}
            >
              <div className={`flex gap-[6px]`}>
                <FaRegCircle className="text-red-600" />
                <div className="text-zinc-600 text-sm font-normal">Reject</div>
              </div>
            </DropdownMenuLabel>
          </>
        )}
        {isHrView && (
          <>
            <DropdownMenuLabel
              onClick={() => handleOptionSelect(row, "accepted by hr")}
            >
              <div className={`flex gap-[6px] items-center`}>
                <FaRegCircle className="text-green-600" />
                <div className="text-zinc-600 text-sm font-normal">
                  Accept by HR
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuLabel
              onClick={() => handleOptionSelect(row, "rejected by hr")}
            >
              <div className={`flex gap-[6px]`}>
                <FaRegCircle className="text-gray-600" />
                <div className="text-zinc-600 text-sm font-normal">
                  Reject by HR
                </div>
              </div>
            </DropdownMenuLabel>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RenderExitTableAction;
