import moment from "moment";
import React, { useState } from "react";
import { RenderResignationAction } from "./Sections";
import {
  ViewDetailHeader,
  Labels,
  ViewDetailBox,
  ViewAttachmentDetail,
} from "components";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  ResignationStatus,
  ResignationReason,
  ManagerName,
} from "utils/getValuesFromTables";

const ExitDetailsCard = ({
  onClose,
  resignationId,
  isResignation = true,
  resignationsList,
}) => {
  const [resignation, setResignation] = useState(
    resignationsList.find((item) => item.id === resignationId)
  );
  const [currentResignationId, setCurrentResignationId] =
    useState(resignationId);

  const handleNext = () => {
    const currentIndex = resignationsList.findIndex(
      (item) => item.id === currentResignationId
    );
    if (currentIndex < resignationsList.length - 1) {
      const currentResignation = resignationsList[currentIndex + 1];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    } else {
      const currentResignation = resignationsList[0];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = resignationsList.findIndex(
      (item) => item.id === currentResignationId
    );
    if (currentIndex > 0) {
      const currentResignation = resignationsList[currentIndex - 1];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    } else {
      const currentResignation = resignationsList[resignationsList.length - 1];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    }
  };

  return (
    <div className="bg-white view-modal-card hideScroll">
      <ViewDetailHeader
        onNextClick={handleNext}
        onPreviousClick={handlePrevious}
        closeModel={onClose}
      />
      <div className="mt-9">
        <section className="flex flex-col mt-10 w-full max-md:max-w-full justify-start items-start gap-2">
          <Labels
            label={`${isResignation ? "Resignation" : "Termination"}`}
            backgroungColor={`bg-[#f4e4eb]`}
          />
          <div className="flex flex-wrap items-center justify-between w-full">
            <div className="flex flex-col gap-2 justify-start">
              <h1 className="text-2xl font-bold text-zinc-800 mb-0">
                {resignation.emp_name}
              </h1>
              <p className=" text-base text-zinc-600">
                ID: <EmployeeID value={resignation?.employee_id} /> |{" "}
                <DesignationName value={resignation.department_position} /> |
                <DepartmentName value={resignation.department_name} />
              </p>
            </div>
            {isResignation ? (
              <RenderResignationAction
                row={resignation}
                viewMode={true}
              />
            ) : (
              <></>
            )}
          </div>
        </section>
        <section>
          <ViewDetailBox
            labelList={[
              {
                label: "Joining date",
                value: moment(resignation?.joining_date).format("DD-MM-YYYY"),
              },
              {
                label: "Status",
                value: ResignationStatus(resignation.status_resignation),
              },
              {
                label: "Report to",
                value: <ManagerName value={resignation.report_to[0]} />,
              },
              {
                label: "Reason for leaving",
                value: ResignationReason(resignation.exit_type),
              },

              {
                label: "Exit date",
                value: moment(resignation?.exit_date).format("DD-MM-YYYY"),
              },

              {
                label: "Notice Period",
                value: resignation.notice_period || "N/A",
              },
              {
                label: "Phone no.",
                value: `${resignation?.country_code || ""}${
                  resignation?.mobile_no || ""
                }`,
              },
            ]}
          />
          <ViewAttachmentDetail
            title={"Attachments"}
            attachments={[
              {
                name: `${resignation.emp_name} - Resignation letter`,
                file: resignation?.resignation_letter,
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
};

export default ExitDetailsCard;
