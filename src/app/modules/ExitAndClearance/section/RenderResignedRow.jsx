import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import { EmployeeNameInfo } from "components";
import { CiEdit } from "react-icons/ci";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Col } from "reactstrap";
import { FiEye } from "react-icons/fi";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import moment from "moment";
import { ManagerName } from "utils/getValuesFromTables";
// import AllotLeavesForm from "./AllotLeavesForm";
import PdfIcon from "assets/images/pdfPreview.png";
import { MdOutlineFileDownload } from "react-icons/md";
import Letter from "app/modules/EmployeesExit/sections/Letter";

const RenderResignedRow = ({
  resignedEmployee,
  resignedEmployeeList,
  reload,
}) => {
  const [openResignedDetails, setopenResignedDetails] = useState(null);
  const [ResignedDetailIndex, setResignedDetailIndex] = useState(null);

  const handleResignedDetails = (ResignedEmp) => {
    setResignedDetailIndex(
      resignedEmployeeList.findIndex(
        (obj) => obj.emp_id === ResignedEmp.emp_id
      )
    );
    setopenResignedDetails(ResignedEmp);
  };
  console.log("resignedEmployee", resignedEmployee);
  const closeModal = () => {
    setopenResignedDetails(null);
  };
  const next = () => {
    const nextIndex = ResignedDetailIndex + 1;
    if (nextIndex < resignedEmployeeList.length) {
      setResignedDetailIndex(nextIndex);
      setopenResignedDetails(resignedEmployeeList[nextIndex]);
    } else {
      setResignedDetailIndex(0);
      setopenResignedDetails(resignedEmployeeList[0]);
    }
  };
  const previous = () => {
    const previousIndex = ResignedDetailIndex - 1;
    const listLength = resignedEmployeeList.length;
    if (previousIndex !== -1) {
      setResignedDetailIndex(previousIndex);
      setopenResignedDetails(resignedEmployeeList[previousIndex]);
    } else {
      setResignedDetailIndex(listLength - 1);
      setopenResignedDetails(resignedEmployeeList[listLength - 1]);
    }
  };
  return (
    <>
      {openResignedDetails && (
        <ResignedDetails
          ResignedData={openResignedDetails}
          closeModel={closeModal}
          next={next}
          previous={previous}
        />
      )}
      <div className="flex flex-row justify-between items-center  flex-wrap gap-x-10 gap-y-5 px-2 py-3 mt-3">
        <div
          className=""
          style={{ maxWidth: "calc(100% - 11.7rem)", minWidth: "420px" }}
        >
          <EmployeeNameInfo
            name={resignedEmployee.emp_name}
            department={resignedEmployee.department_name}
            position={resignedEmployee.department_position}
            id={resignedEmployee.id}
          />
        </div>
        <div className="text-base text-baseGray flex items-center gap-x-4">
          <div
            className="border px-3 py-2 rounded-md border-gray-400 flex cursor-pointer"
            onClick={() => {
              handleResignedDetails(resignedEmployee);
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

const ResignedDetails = ({ ResignedData, closeModel, next, previous }) => {
  return (
    <div
      className="flex flex-wrap gap-5 justify-between items-start mt-3 w-full max-md:max-w-full bg-white"
    >
      <div className="bg-white h-screen fixed  max-w-[40%] w-[40%] top-0 right-0  shadow-lg p-10 overflow-y-auto hideScroll z-30">
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
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
        <div className="mt-9">
          <section className="flex flex-col mt-10 w-full max-md:max-w-full justify-start items-start gap-2">
            <div className="gap-1.5 self-start px-3.5 py-1.5 text-base leading-none whitespace-nowrap bg-[#f4e4eb] min-h-[28px] rounded-[100px] text-zinc-600">
              Resigned
            </div>
            <h1 className="text-2xl font-bold text-zinc-800">
              {ResignedData.emp_name}
            </h1>
            <p className=" text-base text-zinc-600">
              ID:{ResignedData?.employee_id} I{" "}
              <DesignationName value={ResignedData.department_position} /> I
              <DepartmentName value={ResignedData.department_name} />
            </p>
          </section>
          <EmploymentDetails ResignedData={ResignedData} />
          {ResignedData?.resignation_letter &&
            ResignedData?.resignation_letter?.name && (
              <Letter
                name={ResignedData.emp_name}
                file={ResignedData.resignation_letter}
              />
            )}
        </div>
      </div>
    </div>
  );
};
function EmploymentDetails({ ResignedData }) {
  const details = [
    {
      label: "Joining date",
      value: moment(ResignedData?.date_joined).format("DD-MM-YYYY"),
    },
    { label: "Reason for leaving", value: "dummy" },
    { label: "Phone no.", value: ResignedData?.mobile_no || "N/A" },
    { label: "Status", value: ResignedData.status_resignation || "N/A" },
    { label: "Exit date", value: ResignedData?.exit_date || "N/A" },
    {
      label: "Report to",
      value: <ManagerName value={ResignedData.report_to[0]} />,
    },
    { label: "Notice Period", value: ResignedData.notice_period || "N/A" },
  ];

  return (
    <section className="flex flex-col mt-10 w-full leading-none min-h-[222px] text-zinc-600 max-md:max-w-full rounded-[5px] border border-[#dadada]">
      <div className="flex flex-col justify-center px-6 py-3.5 w-full rounded-md max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 items-start max-md:max-w-full">
          {details.map((detail, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-start"
            >
              <div className="flex flex-col items-start justify-start">
                <div className="text-sm tracking-tight capitalize">
                  {detail.label}
                </div>
                <div className="mt-2 text-base font-semibold tracking-tight capitalize">
                  {detail.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RenderResignedRow;
