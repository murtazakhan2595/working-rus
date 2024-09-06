import { useState } from "react";
import { EmployeeNameInfo } from "components";
import { FiEye } from "react-icons/fi";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  ResignationStatus,
  ResignationReason,
  ManagerName,
} from "utils/getValuesFromTables";
import moment from "moment";

const RenderResignedRow = ({ resignedEmployee, resignedEmployeeList }) => {
  const [openResignedDetails, setopenResignedDetails] = useState(null);
  const [ResignedDetailIndex, setResignedDetailIndex] = useState(null);
  const handleResignedDetails = (ResignedEmp) => {
    setResignedDetailIndex(
      resignedEmployeeList.findIndex((obj) => obj.emp_id === ResignedEmp.emp_id)
    );
    setopenResignedDetails(ResignedEmp);
  };
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
          style={{ maxWidth: "calc(100% - 12.5rem)", minWidth: "420px" }}
        >
          <EmployeeNameInfo
            name={resignedEmployee.emp_name}
            department={resignedEmployee.department_name}
            position={resignedEmployee.position}
            id={resignedEmployee.employee_id}
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
  console.log("ResignedData", ResignedData);
  return (
    <div className="bg-white view-modal-card hideScroll">
      <ViewDetailHeader
        title={"Completed exit requests"}
        onNextClick={next}
        onPreviousClick={previous}
        closeModel={closeModel}
      />
      <div className="mt-9">
        <section className="flex flex-col mt-10 w-full max-md:max-w-full justify-start items-start gap-2">
          <Labels label={"Resigned"} backgroungColor={`bg-[#f4e4eb]`} />
          <h1 className="text-2xl font-bold text-zinc-800 mb-0">
            {ResignedData.emp_name}
          </h1>
          <p className=" text-base text-zinc-600">
            ID:
            <EmployeeID value={ResignedData?.employee_id} /> |{" "}
            <DesignationName value={ResignedData.position} /> |
            <DepartmentName value={ResignedData.department_name} />
          </p>
        </section>
        <section>
          <ViewDetailBox
            labelList={[
              {
                label: "Joining date",
                value: moment(ResignedData?.joining_date).format("DD-MM-YYYY"),
              },
              {
                label: "Status",
                value: ResignationStatus(ResignedData.status_resignation),
              },
              {
                label: "Report to",
                value: <ManagerName value={ResignedData.report_to} />,
              },
              {
                label: "Reason for leaving",
                value: ResignationReason(ResignedData.exit_type),
              },

              {
                label: "Exit date",
                value: moment(ResignedData?.exit_date).format("DD-MM-YYYY"),
              },

              {
                label: "Notice Period",
                value: ResignedData.notice_period || "N/A",
              },
              {
                label: "Phone no.",
                value: `${ResignedData?.country_code || ""}${
                  ResignedData?.mobile_no || ""
                }`,
              },
            ]}
          />
          <ViewAttachmentDetail
            title={"Attachments"}
            attachments={[
              {
                name: `${ResignedData.emp_name} - Resignation letter`,
                file: ResignedData?.resignation_letter,
              },
              {
                name: `${ResignedData.emp_name} - Clearance letter`,
                file: ResignedData?.clearance_report,
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
};
const ViewDetailBox = ({ labelList }) => {
  return (
    <div className="mt-3">
      <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg pr-3 pl-4 py-4">
        {labelList &&
          labelList.map((data, index) => {
            return (
              <div className="text-left" key={index}>
                <p class="text-[14px] font-normal">{data?.label}</p>
                <p class="text-[14px] font-semibold">{data?.value ?? "N/A"}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ViewAttachmentDetail = ({ title, attachments }) => {
  return (
    <div className="mt-3">
      <h3 className="font-bold text-base text-[#323333] text-left">{title}</h3>
      {attachments &&
        attachments.map((attachment, index) => {
          if (!attachment.file || !attachment?.file?.file) return "";
          return (
            <div
              key={index}
              className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center my-3"
            >
              <div className="flex gap-x-3">
                <img src={pdfIcon} alt="" />
                <p class="text-[14px] text-[#323333]">
                  <span>{attachment?.name}</span>
                  <span>
                    <p className="self-start mt-1 text-xs leading-none text-zinc-600 text-left">
                      {getFileSizeInKB(attachment?.file?.file)} KB
                    </p>
                  </span>
                </p>
              </div>
              <div
                className="flex gap-x-2 cursor-pointer"
                onClick={() =>
                  filebase64Download(attachment?.file, attachment?.name)
                }
              >
                <p class="text-[14px] text-[#323333]">Download</p>
                <AiOutlineDownload />
              </div>
            </div>
          );
        })}
    </div>
  );
};

const ViewDetailHeader = ({
  onNextClick,
  onPreviousClick,
  closeModel,
  title,
}) => {
  return (
    <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
      <div className="flex flex-wrap">
        <div className="flex">
          <span className="text-xl m-auto">{title}</span>
        </div>
        <div className="flex justify-center ">
          <button
            className="flex items-center px-2 py-2"
            onClick={() => {
              onPreviousClick();
            }}
          >
            <IoChevronBack className="" /> Previous
          </button>
          <button
            className="flex items-center px-2 py-2"
            onClick={() => onNextClick()}
          >
            Next <IoChevronForward className="" />
          </button>
        </div>
      </div>
      <RxCross2
        className="cursor-pointer"
        onClick={() => {
          closeModel();
        }}
      />
    </div>
  );
};
export default RenderResignedRow;
