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
import  PdfIcon  from 'assets/images/pdfPreview.png';
import { MdOutlineFileDownload } from "react-icons/md";
import { TerminationReason } from "utils/getValuesFromTables";

const RenderTerminatedRow = ({
  terminatedEmployee,
  terminatedEmployeeList,
  reload,
}) => {
  const [openTerminatedDetails, setOpenTerminatedDetails] = useState(null);
  const [terminatedDetailIndex, setTerminatedDetailIndex] =
    useState(null);

  const handleTerminatedDetails = (terminatedEmp) => {
    setTerminatedDetailIndex(
      terminatedEmployeeList.findIndex(
        (obj) => obj.emp_id === terminatedEmp.emp_id
      )
    );
    setOpenTerminatedDetails(terminatedEmp);
  };
  console.log("terminatedEmployee", terminatedEmployee);
  const closeModal = () => {
    setOpenTerminatedDetails(null);
  };
    const next = () => {
      const nextIndex = terminatedDetailIndex + 1;
      if (nextIndex < terminatedEmployeeList.length) {
        setTerminatedDetailIndex(nextIndex);
        setOpenTerminatedDetails(terminatedEmployeeList[nextIndex]);
      } else {
        setTerminatedDetailIndex(0);
        setOpenTerminatedDetails(terminatedEmployeeList[0]);
      }
    };
    const previous = () => {
      const previousIndex = terminatedDetailIndex - 1;
      const listLength = terminatedEmployeeList.length;
      if (previousIndex !== -1) {
        setTerminatedDetailIndex(previousIndex);
        setOpenTerminatedDetails(terminatedEmployeeList[previousIndex]);
      } else {
        setTerminatedDetailIndex(listLength - 1);
        setOpenTerminatedDetails(terminatedEmployeeList[listLength - 1]);
      }
    };
  return (
    <>
      {openTerminatedDetails && (
        <TerminatedDetails
          terminatedData={openTerminatedDetails}
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
            name={terminatedEmployee.emp_name}
            department={terminatedEmployee.department_name}
            position={terminatedEmployee.department_position}
            id={terminatedEmployee.employee_id}
          />
        </div>
        <div className="text-base text-baseGray flex items-center gap-x-4">
          <div
            className="border px-3 py-2 rounded-md border-gray-400 flex cursor-pointer"
            onClick={() => {
              handleTerminatedDetails(terminatedEmployee);
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

const TerminatedDetails = ({ terminatedData, closeModel, next, previous }) => {
  return (
    <div className="flex flex-wrap gap-5 justify-between items-start mt-3 w-full max-md:max-w-full bg-white ">
      <div className="bg-white h-screen fixed  max-w-[40%] w-[40%] top-0 right-0  shadow-lg p-10 overflow-y-auto z-30 hideScroll">
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
              Terminated
            </div>
            <h1 className="text-2xl font-bold text-zinc-800">
              {terminatedData.emp_name}
            </h1>
            <p className=" text-base text-zinc-600">
              ID:{terminatedData?.employee_id} I{" "}
              <DesignationName value={terminatedData.department_position} /> I
              <DepartmentName value={terminatedData.department_name} />
            </p>
          </section>
          <EmploymentDetails terminatedData={terminatedData} />
          {terminatedData?.termination_letter &&
            terminatedData?.termination_letter?.name && (
              <TerminationLetter
                name={terminatedData.emp_name}
                file={terminatedData.termination_letter}
              />
            )}
        </div>
      </div>
    </div>
  );
};
function EmploymentDetails({ terminatedData }) {
  const details = [
    {
      label: "Joining date",
      value: moment(terminatedData?.date_joined).format("DD-MM-YYYY"),
    },
    {
      label: "Reason for Terminating",
      value: <TerminationReason value={terminatedData.reason_of_termination} />,
    },
    { label: "Phone no.", value: terminatedData?.mobile_no || "N/A" },
    { label: "Status", value: terminatedData.status_termination || "N/A" },
    { label: "Exit date", value: terminatedData?.exit_date || "N/A" },
    {
      label: "Report to",
      value: <ManagerName value={terminatedData.report_to[0]} />,
    },
    { label: "Notice Period", value: terminatedData.notice_period || "N/A" },
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

function TerminationLetter({ name, file }) {
  console.log("file", file);
  console.log("name", name);
  function getFileSizeInKB(base64String) {
    const base64Data = base64String.split(",")[1];
    const binaryString = atob(base64Data);
    const byteLength = binaryString.length;
    const kbSize = byteLength / 1024;
    return kbSize.toFixed(0);
  }
  function handleDownload() {
    const link = document.createElement("a");
    link.href = file.file;
    link.download = file.name || "downloaded-file";
    link.click();
  }

  return (
    <div className="flex flex-col items-start pr-20 mt-3 w-full max-md:pr-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between items-center px-3 pt-2.5 pb-0.5 mt-4 max-w-full bg-gray-100 rounded-lg w-[562px] z-30">
        <div className="flex gap-4">
          <img
            loading="lazy"
            src={PdfIcon}
            alt=""
            className="object-contain shrink-0 aspect-[0.69] w-[25px]"
          />
          <div className="flex flex-col">
            <div className="text-sm leading-none text-zinc-800">{name} - Terminaiton Letter</div>
            <div className="self-start mt-1 text-xs leading-none text-zinc-600">
              {getFileSizeInKB(file.file)} KB
            </div>
          </div>
        </div>
        <button
          className="flex gap-2 my-auto items-center text-sm leading-none whitespace-nowrap text-zinc-800"
          onClick={handleDownload}
        >
          <div className="grow">Download</div>
          <MdOutlineFileDownload className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default RenderTerminatedRow;
