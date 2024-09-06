import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import { EmployeeNameInfo } from "components";
import { CiEdit } from "react-icons/ci";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Col } from "reactstrap";
import { FiEye } from "react-icons/fi";
// import AllotLeavesForm from "./AllotLeavesForm";

const RenderTerminatedRow = ({
  terminatedEmployee,
  terminatedEmployeeList,
  reload,
}) => {
  console.log("terminatedEmployee", terminatedEmployee);
  return (
    <>
      <div className="flex flex-row justify-between items-center  flex-wrap gap-x-10 gap-y-5 px-2 py-3 mt-3">
        <div
          className=""
          style={{ maxWidth: "calc(100% - 11.7rem)", minWidth: "420px" }}
        >
          <div className="flex items-center gap-6 ">
            <div className="w-[55px] h-[55px] bg-[#be24a5] rounded-[100px] justify-center items-center gap-2.5 inline-flex">
              <div className="text-[#fafbfc] text-2xl font-semibold ">SB</div>
            </div>
            <div className=" justify-center items-end gap-5 inline-flex">
              <div className="flex-col justify-start items-start gap-2 inline-flex">
                <div className="text-[#323233] text-base font-bold ">
                  {terminatedEmployee.emp_name}
                </div>
                <div className="justify-start items-start gap-[5px] inline-flex">
                  <div className="text-[#5c5e64]/80 text-base font-medium ">
                    UI/UX Designer
                  </div>
                  <div className="text-[#5c5e64]/80 text-base font-semibold ">
                    |
                  </div>
                  <div className="text-[#5c5e64]/80 text-base font-medium ">
                    Design Team
                  </div>
                </div>
              </div>
              <div className="justify-start items-start gap-5 flex">
                <div className="justify-start items-start gap-2 flex">
                  <div className="text-[#7d7e83] text-base font-normal ">
                    ID: 3489094
                  </div>
                </div>
                <div />
              </div>
            </div>
          </div>
        </div>
        <div className="text-base text-baseGray flex items-center gap-x-4">
          <div
            className="border px-3 py-2 rounded-md border-gray-400 flex cursor-pointer"
            onClick={() => {
              // handleAllotLeaves(employee);
            }}
          >
            <FiEye className="text-2xl cursor-pointer opacity-80 mr-2" />
            View Details
          </div>
        </div>
      </div>
    </>
  );
};


export default RenderTerminatedRow;
