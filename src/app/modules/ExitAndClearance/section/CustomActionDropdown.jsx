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
import { TiArrowSortedDown } from "react-icons/ti";


const CustomActionDropdown = ({
  resignation,
  handleOptionSelect,
}) => {
  const [actionDropdown, setActionDropdown] = useState(false);
  const loggedInUser = useSelector((state) => state.user.userProfile);

  const status = resignation.status_resignation;

  const toggleActionDropdown = () => {
    setActionDropdown(!actionDropdown);
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
    <div>
      <ButtonDropdown isOpen={actionDropdown} toggle={toggleActionDropdown}>
        <DropdownToggle className="border-0 shadow-none bg-transparent">
          <button className="flex gap-2 justify-center items-center px-3 py-2 rounded border border-[#5c5e64] ">
            <div className="flex gap-1.5 items-center self-stretch my-auto">
              <span className="self-stretch my-auto text-sm leading-none text-zinc-600">
                Action
              </span>
              <TiArrowSortedDown />
            </div>
          </button>
        </DropdownToggle>
        <DropdownMenu start className="p-6">
          {isMangerView && (
            <>
              <DropdownItem
                onClick={() =>
                  handleOptionSelect(resignation, "accepted by manager")
                }
              >
                <div className={`p-2 flex gap-[6px] items-center`}>
                  <FaRegCircle className="text-lime-600" />
                  <div className="text-zinc-600 text-sm font-normal">
                    Accept
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  handleOptionSelect(resignation, "rejected by manager")
                }
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
                onClick={() =>
                  handleOptionSelect(resignation, "accepted by hr")
                }
              >
                <div className={`p-2 flex gap-[6px] items-center`}>
                  <FaRegCircle className="text-green-600" />
                  <div className="text-zinc-600 text-sm font-normal">
                    Accept by HR
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  handleOptionSelect(resignation, "rejected by hr")
                }
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

export default CustomActionDropdown;
