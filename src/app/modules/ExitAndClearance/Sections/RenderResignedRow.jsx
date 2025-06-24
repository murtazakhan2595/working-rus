import { useState } from "react";
import { EmployeeOverview } from "components";
import { FiEye } from "react-icons/fi";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  ResignationStatus,
  ResignationReason,
  ManagerName,
} from "utils/getValuesFromTables";
import {
  ViewDetailHeader,
  ViewDetailBox,
  ViewAttachmentDetail,
} from "./DetailViewPanel";
import moment from "moment";
// import { Labels } from "components/StatusLabel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../src/@/components/ui/sheet";

const RenderResignedRow = ({ resignedEmployee, resignedEmployeeList }) => {
  const [openResignedDetails, setopenResignedDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [ResignedDetailIndex, setResignedDetailIndex] = useState(null);
  const handleResignedDetails = (ResignedEmp) => {
    setResignedDetailIndex(
      resignedEmployeeList.findIndex((obj) => obj.emp_id === ResignedEmp.emp_id)
    );
    setopenResignedDetails(ResignedEmp);
    setIsOpen(true);
  };
  const closeModal = () => {
    setopenResignedDetails(null);
    setIsOpen(false);
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
    setIsOpen(true);
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
    setIsOpen(true);
  };
  return (
    <>
      {openResignedDetails && (
        <ResignedDetails
          ResignedData={openResignedDetails}
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
          <EmployeeOverview
            id={resignedEmployee.employee_id}
            showPosition={true}
            showDepartment={true}
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

const ResignedDetails = ({
  ResignedData,
  closeModel,
  next,
  previous,
  isOpen,
  setIsOpen,
}) => {
  console.log("ResignedData", ResignedData);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full p-6 sm:max-w-4xl ">
        <div className="flex flex-col h-full">
          <SheetHeader>
            <ViewDetailHeader
              title={"Completed exit requests"}
              onNextClick={next}
              onPreviousClick={previous}
              closeModel={closeModel}
            />
          </SheetHeader>
          <div className="mt-4">
            <section className="flex flex-col mt-10 w-full max-md:max-w-full justify-start items-start gap-2">
              {/* <Labels label={"Resigned"} backgroungColor={`bg-[#f4e4eb]`} /> */}
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
                    value: moment(ResignedData?.joining_date).format(
                      "DD-MM-YYYY"
                    ),
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
      </SheetContent>
    </Sheet>
  );
};

export default RenderResignedRow;
