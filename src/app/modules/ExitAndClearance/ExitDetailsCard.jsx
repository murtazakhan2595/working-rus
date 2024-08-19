// import { addLeaveRequest } from "app/hooks/leaveManagment";
import { getEmployeeData } from "app/hooks/employee";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  IoArrowForward,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import  PdfIcon from 'assets/images/pdfPreview.png';
import { ManagerName } from "utils/getValuesFromTables";
import {CustomActionDropdown} from "./Sections";
import { MdOutlineFileDownload } from "react-icons/md";

const ExitDetailsCard = ({
  onClose,
  resignation,
  onNext,
  onPrevious,
  disableNext,
  disablePrevious,
  handleOptionSelect,
}) => {
  console.log("resignation", resignation);
  const [workInformation, setWorkInformation] = useState(null);
  const designations = useSelector((state) => state.common.designations);
  const employeeDesignation = designations.find((designation) => {
    return designation.value === Number(workInformation?.department_position);
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployeeData(resignation?.employee_id);
        if (response) {
          setWorkInformation(response);
        }
      } catch (err) {
        console.error("Error fetching resignation data", err);
      }
    };
    fetchData();
  }, [resignation]);

  return (
    <div className="fixed top-0 right-0 max-w-[40%] w-[40%] h-screen z-10 overflow-y-auto hideScroll pl-10">
      <div className="bg-white h-screen fixed  max-w-[40%] w-[40%] top-0 right-0  shadow-lg p-10 overflow-y-auto hideScroll">
        <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
          <div className="flex justify-center ">
            <button
              className="flex items-center px-2 py-2"
              onClick={onPrevious}
              disabled={disablePrevious}
            >
              <IoChevronBack className="mr-2" /> Previous
            </button>
            <button
              className="flex items-center px-2 py-2 ml-4"
              onClick={onNext}
              disabled={disableNext}
            >
              Next <IoChevronForward className="ml-2" />
            </button>
          </div>
          <RxCross2
            className=" cursor-pointer"
            onClick={() => {
              onClose();
            }}
          />
        </div>
        <div className="mt-9">
          <section className="flex flex-col mt-10 w-full max-md:max-w-full">
            <div className="gap-1.5 self-start px-3.5 py-1.5 text-base leading-none whitespace-nowrap bg-orange-100 min-h-[28px] rounded-[100px] text-zinc-600">
              Resignation
            </div>
            <div className="flex flex-wrap gap-5 justify-between items-start mt-3 w-full max-md:max-w-full">
              <div className="flex gap-2.5 items-center min-h-[59px] min-w-[240px]">
                <div className="flex flex-col self-stretch my-auto min-w-[240px]">
                  <h1 className="text-2xl font-bold text-zinc-800">
                    {resignation?.name}
                  </h1>
                  <p className="gap-5 mt-2.5 text-base text-zinc-600">
                    ID:{resignation?.employee_id} I {employeeDesignation?.label}{" "}
                    I {resignation?.department_name?.[0]}
                  </p>
                </div>
              </div>
              <CustomActionDropdown
                resignation={resignation}
                handleOptionSelect={handleOptionSelect}
              />
            </div>
          </section>
          <EmploymentDetails
            resignation={resignation}
            workInformation={workInformation}
          />
          {resignation?.resignation_letter &&
            resignation?.resignation_letter?.name && (
              <ResignationLetter
                name={resignation.name}
                file={resignation.resignation_letter}
              />
            )}
        </div>
      </div>
    </div>
  );
};

function EmploymentDetails({resignation, workInformation}) {
  const details = [
    {
      label: "Joining date",
      value: moment(workInformation?.dateJoined).format("DD-MM-YYYY"),
    },
    { label: "Reason for leaving", value: resignation?.exit_type },
    { label: "Phone no.", value: workInformation?.mobile_no || "N/A" },
    { label: "Status", value: resignation.status_resignation || "N/A" },
    { label: "Exit date", value: resignation?.exit_date || "N/A" },
    {
      label: "Report to",
      value: <ManagerName value={resignation.report_to} />,
    },
    { label: "Notice Period", value: resignation.notice_period || "N/A" },
  ];

  return (
    <section className="flex flex-col mt-10 w-full leading-none min-h-[222px] text-zinc-600 max-md:max-w-full rounded-[5px] border border-[#dadada]">
      <div className="flex flex-col justify-center px-6 py-3.5 w-full rounded-md max-md:pl-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 items-start max-md:max-w-full">
          {details.map((detail, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="flex flex-col ">
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

function ResignationLetter({ name, file }) {
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
    <div className="flex flex-col items-start pr-20 mt-5 w-full max-md:pr-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between items-center px-3 pt-2.5 pb-0.5 mt-4 max-w-full bg-gray-100 rounded-lg w-[562px]">
        <div className="flex gap-4">
          <img
            loading="lazy"
            src={PdfIcon}
            alt=""
            className="object-contain shrink-0 aspect-[0.69] w-[25px]"
          />
          <div className="flex flex-col">
            <div className="text-sm leading-none text-zinc-800">{name}</div>
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


export default ExitDetailsCard;

