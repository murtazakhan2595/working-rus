import { useState } from "react";
import {
  EmployeeNameInfo,
  ViewDetailHeader,
  Labels,
  ViewDetailBox,
  ViewAttachmentDetail,
} from "components";
import { FiEye } from "react-icons/fi";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  ResignationStatus,
  ResignationReason,
  ManagerName
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
            <DesignationName value={ResignedData.department_position} /> |
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
                value: <ManagerName value={ResignedData.report_to[0]} />,
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
            ]}
          />
        </section>
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
    { label: "Reason for leaving", value: ResignedData.exit_type },
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
