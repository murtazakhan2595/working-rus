import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import { EmployeeNameInfo, Header, PageLoader } from "components";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { PiBriefcaseThin } from "react-icons/pi";
import { IoArrowForward } from "react-icons/io5";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { convertToK } from "../../../../utils/ConvertToK";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import moment from "moment";
import { FilterInput } from "components/form-control";
import AllotLeavesForm from "./AllotLeavesForm";

const RenderEmployeesLeaveAllotement = ({ employee, employeeList }) => {
  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const [openLeaveAllotment, setOpenLeaveAllotment] = useState(null);
  const [openLeaveAllotmentIndex, setOpenLeaveAllotmentIndex] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployeeLeaveTypes({
        employee_id: employee.id,
      });
      setEmployeeLeaveTypes({
        leaveTypes: data.leaveTypes,
        allotedLeave: data.allotedLeaves,
      });
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);
  const handleAllotLeaves = (employee) => {
    setOpenLeaveAllotmentIndex(
      employeeList.findIndex((obj) => obj.id === employee.id)
    );
    setOpenLeaveAllotment(employee);
  };
  const closeModal = () => {
    setOpenLeaveAllotment(null);
    getPosts();
  };
  const next = () => {
    const nextIndex = openLeaveAllotmentIndex + 1;
    if (nextIndex < employeeList.length) {
      setOpenLeaveAllotmentIndex(nextIndex);
      setOpenLeaveAllotment(employeeList[nextIndex]);
    } else {
      setOpenLeaveAllotmentIndex(0);
      setOpenLeaveAllotment(employeeList[0]);
    }
  };
  const previous = () => {
    const previousIndex = openLeaveAllotmentIndex - 1;
    const listLength = employeeList.length;
    if (previousIndex !== -1) {
      setOpenLeaveAllotmentIndex(previousIndex);
      setOpenLeaveAllotment(employeeList[previousIndex]);
    } else {
      setOpenLeaveAllotmentIndex(listLength - 1);
      setOpenLeaveAllotment(employeeList[listLength - 1]);
    }
  };
  return (
    <>
      {openLeaveAllotment && (
        <Col md={6}>
          <AllotLeaves
            employeeData={openLeaveAllotment}
            closeModel={closeModal}
            next={next}
            previous={previous}
          />
        </Col>
      )}{" "}
      <div className="flex flex-row justify-between flex-wrap gap-x-10 gap-y-5 border-b px-2 pb-4">
        <EmployeeNameInfo
          name={`${employee.first_name} ${employee.last_name}`}
          department={employee.department_name}
          position={employee.department_position}
          id={employee.id}
          leaveTypes={employeeLeaveTypes.leaveTypes}
          allotedLeave={employeeLeaveTypes.allotedLeave}
        />
        <div className="text-base text-baseGray flex items-center gap-x-4">
          <div
            className="border px-3 py-2 rounded-md border-gray-400 flex cursor-pointer"
            onClick={() => {
              handleAllotLeaves(employee);
            }}
          >
            <CiEdit className="text-2xl cursor-pointer opacity-80 mr-2" />
            Allot leaves
          </div>
        </div>
      </div>
    </>
  );
};

const AllotLeaves = ({ employeeData, closeModel, next, previous }) => {
  return (
    <div className="fixed top-0 text-baseGray right-0 w-[650px] h-full z-10 overflow-y-auto hideScroll pl-10">
      <div className="h-auto p-10 bg-[#FAFBFC]" style={{ minHeight: "100vh" }}>
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
          <h2 className="font-bold text-xl ">Leave allotment</h2>
          <div className="flex justify-center ">
            <button
              className="flex items-center px-2 py-2"
              onClick={() => {
                previous();
              }}
            >
              <IoChevronBack className="" /> Previous
            </button>
            <button
              className="flex items-center px-2 py-2"
              onClick={() => next()}
            >
              Next <IoChevronForward className="" />
            </button>
          </div>
          <RxCross2
            className=" cursor-pointer"
            onClick={() => {
              closeModel();
            }}
          />
        </div>
        <AllotLeavesForm employeeData={employeeData} closeModel={closeModel} />
      </div>
    </div>
  );
};

export default RenderEmployeesLeaveAllotement;
