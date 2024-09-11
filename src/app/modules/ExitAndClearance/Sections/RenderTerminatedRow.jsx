import { useState } from "react";
import { FiEye } from "react-icons/fi";
import moment from "moment";

import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  ResignationStatus,
  ResignationReason,
  ManagerName,
} from "utils/getValuesFromTables";
import { EmployeeNameInfo } from "components";
import { Labels } from "components/StatusLabel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../src/@/components/ui/sheet";

import {
  ViewDetailBox,
  ViewDetailHeader,
  ViewAttachmentDetail,
} from "./DetailViewPanel";

const RenderTerminatedRow = ({
  terminatedEmployee,
  terminatedEmployeeList,
}) => {
  const [openTerminatedDetails, setOpenTerminatedDetails] = useState(null);
  const [terminatedDetailIndex, setTerminatedDetailIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTerminatedDetails = (terminatedEmp) => {
    setTerminatedDetailIndex(
      terminatedEmployeeList.findIndex(
        (obj) => obj.emp_id === terminatedEmp.emp_id
      )
    );
    setOpenTerminatedDetails(terminatedEmp);
    setIsOpen(true);
  };
  const closeModal = () => {
    setOpenTerminatedDetails(null);
    setIsOpen(false);
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
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      <div className="flex flex-row justify-between items-center  flex-wrap gap-x-10 gap-y-5 px-2 py-3 mt-3">
        <div
          className=""
          style={{ maxWidth: "calc(100% - 12.5rem)", minWidth: "420px" }}
        >
          <EmployeeNameInfo
            name={terminatedEmployee.emp_name}
            department={terminatedEmployee.department_name}
            position={terminatedEmployee.position}
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

const TerminatedDetails = ({
  terminatedData,
  closeModel,
  next,
  previous,
  isOpen,
  setIsOpen,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full p-6 sm:max-w-4xl ">
        <div className="flex flex-col h-full">
          <SheetHeader>
            <ViewDetailHeader
              onNextClick={next}
              onPreviousClick={previous}
              closeModel={closeModel}
            />
          </SheetHeader>
          <div className="mt-4">
            <section className="flex flex-col mt-10 w-full max-md:max-w-full justify-start items-start gap-2">
              <Labels label={"Terminated"} backgroungColor={`bg-[#f4e4eb]`} />
              <h1 className="text-2xl font-bold text-zinc-800">
                {terminatedData.emp_name}
              </h1>
              <p className=" text-base text-zinc-600">
                ID: <EmployeeID value={terminatedData?.employee_id} /> |{" "}
                <DesignationName value={terminatedData.position} /> I
                <DepartmentName value={terminatedData.department_name} />
              </p>
            </section>
            <section>
              <ViewDetailBox
                labelList={[
                  {
                    label: "Joining date",
                    value: moment(terminatedData?.joining_date).format(
                      "DD-MM-YYYY"
                    ),
                  },
                  {
                    label: "Status",
                    value: ResignationStatus(terminatedData.status_resignation),
                  },
                  {
                    label: "Report to",
                    value: <ManagerName value={terminatedData.report_to} />,
                  },
                  {
                    label: "Reason for leaving",
                    value: ResignationReason(terminatedData.exit_type),
                  },

                  {
                    label: "Exit date",
                    value: moment(terminatedData?.exit_date).format(
                      "DD-MM-YYYY"
                    ),
                  },

                  {
                    label: "Notice Period",
                    value: terminatedData.notice_period || "N/A",
                  },
                  {
                    label: "Phone no.",
                    value: `${terminatedData?.country_code || ""}${
                      terminatedData?.mobile_no || ""
                    }`,
                  },
                ]}
              />
              <ViewAttachmentDetail
                title={"Attachments"}
                attachments={[
                  {
                    name: `${terminatedData.emp_name} - Resignation letter`,
                    file: terminatedData?.termination_letter,
                  },
                  {
                    name: `${terminatedData.emp_name} - Clearance letter`,
                    file: terminatedData?.clearance_report,
                  },
                ]}
              />
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default RenderTerminatedRow;
