import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { PiBriefcaseThin } from "react-icons/pi";
import { IoArrowForward } from "react-icons/io5";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { convertToK } from "../../../../utils/ConvertToK";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import moment from "moment";
import { FilterInput } from "components/form-control";
import AllotLeavesForm from "./AllotLeavesForm";

const AllotLeaves = ({ employeeData, closeModel }) => {
  const [showEdit, setShowEdit] = useState(false);

  const handleEditClick = () => {
    setShowEdit(true);
  };

  const handleEditClose = () => {
    setShowEdit(false);
  };
  return (
    <div className="fixed top-0 text-baseGray right-0 w-[60%] h-full z-10 overflow-y-auto hideScroll pl-10">
      <div className="h-auto p-10 bg-[#FAFBFC]">
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
          <h2 className="font-bold text-xl ">Leave allotment</h2>
          <div className="flex justify-center ">
            <button className="flex items-center px-2 py-2">
              <IoChevronBack className="mr-2" /> Previous
            </button>
            <button className="flex items-center px-2 py-2 ml-4">
              Next <IoChevronForward className="ml-2" />
            </button>
          </div>
          <RxCross2
            className=" cursor-pointer"
            onClick={() => {
              closeModel();
            }}
          />
        </div>
        <AllotLeavesForm employeeData ={employeeData} closeModel={closeModel}/>
      </div>
    </div>
  );
};

export default AllotLeaves;
