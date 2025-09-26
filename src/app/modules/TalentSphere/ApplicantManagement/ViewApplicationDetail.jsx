import { toast } from "react-toastify";
import React, { useState } from "react";
import { FormatID } from "utils/getValuesFromTables";
import { getApplicantsData, saveUpdateApplication } from "app/hooks/talentSphere";
import {
  ClearanceSheet,
  UploadExitInterviewDetails,
} from "app/modules/ExitAndClearance";
import { Button } from "components/ui/button";
// import { CoverFileUpload } from "components/FormControl";
import {
  EmployeeOverview,
  EmployeeDetailUI,
  StatusLabel,
  NavigationSheetComponent,
  DetailContent,
  StatusList,
  StatusButtons,
} from "components";
import { handleRequest } from "app/hooks/general";
import { renderDate } from "utils/renderValues";
import AttachmentUI from "components/ui/AttachmentUI";
import { EmployeeName } from "utils/getValuesFromTables";
import { RecruitmentApplicationSource } from "data/Data";

export const ExitDetails = (isResignation) => [
  {
    customContent: true,
    renderContent: (data) => {
      return (
        <div className="flex flex-wrap justify-end gap-2 items-center">
          <div className="flex justify-end gap-2 flex-wrap">
            <StatusLabel status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
          </div>
        </div>
      );
    },
  },
  {
    title: "Candidate Information",
    field: [
      {
        key: "candidate_name",
        label: "Candidate Name",
      },
      {
        key: "candidate_id",
        label: "Candidate ID",
      },
      {
        key: "email",
        label: "Email Address",
      },
      {
        key: "contact_number",
        label: "Contact Number",
      },
      {
        key: "emiratization_flag",
        label: "Emiration Eligibity",
        formatter: (cell) => cell ? 'Yes' : 'No',
      },
    ],
  },
  {
    title: `Application Details`,
    footerTitle: "Request At",
    footerField: "created_at",
    field: [
      {
        key: "id",
        label: "Id",
        formatter: (cell, row) => <FormatID value={cell} prefix={"APP-"} />,
      },
      {
        key: "job_title",
        label: "Job Title",
        // formatter: (cell) => renderDate(cell),
      },
      {
        key: "job_description",
        label: "Job Description",
        // formatter: (cell) => renderDate(cell),
      },

      {
        key: "department",
        label: "Department",
        formatter: (cell) => renderDate(cell, "--"),
      },
      {
        key: "location",
        label: "Location",
      },
      {
        key: "job_type_name",
        label: "Job Type",
      },
      {
        key: "career_level_name",
        label: "Career Level",
      },
      {
        key: "education",
        label: "Education Requirement",
      },
      {
        key: "notice_period",
        label: "Experience Requirement",
      },
      {
        key: "application_source",
        label: "Application Source",
        formatter: (cell) => {
          return (RecruitmentApplicationSource.find(obj => obj.value === cell) || {}).label || '--';
        },
      },
      {
        key: "application_date",
        label: "Application Date",
        formatter: (cell) => renderDate(cell, "--"),
      },
    ],
  },
  {
    title: `Resume/Attachment`,
    field: [
      {
        key: "attachment",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`${data.candidate_name} Resume`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">No letter attached</div>
          ),
      },
    ],
  },
  {
    title: "Candidate Information",
    renderSectionCondition: (data) => {
      if (data.status === 'rejected') return true;
      return false;
    },
    field: [
      {
        key: "candidate_name",
        label: "Candidate Name",
      },
      {
        key: "candidate_id",
        label: "Candidate ID",
      },
      {
        key: "email",
        label: "Email Address",
      },
      {
        key: "contact_number",
        label: "Contact Number",
      },
      {
        key: "emiratization_flag",
        label: "Emiration Eligibity",
        formatter: (cell) => cell ? 'Yes' : 'No',
      },
    ],
  },
];

const ViewApplicationDetail = ({
  currentId,
  isResignation = true,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  handleUploadClearanceReportClick = () => { },
}) => {
  const [forceLoad, setForceLoad] = useState(false);
  const [openClearanceForm, setOpenClearanceForm] = useState(false);
  const [openexitInterviewForm, setOpenexitInterviewForm] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [exitData, setExitData] = useState(null);
  const handleSubmit = async ({ status, id }, successMessage) => {
    try {

      const response = await saveUpdateApplication({ status }, id);
      // return
      if (response) {
        toast.success(`Application ${successMessage}Successfully!`);

        setForceLoad(!forceLoad);
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    }
  };

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentItemId(data.id);
      if (status === 'resume_bank') {
        handleSubmit({ id: data.id, status: status }, 'Resumed')
      }
      if (status === 'screened') {
        handleSubmit({ id: data.id, status: status }, 'Screened')
      }
      if (status === "INITIATED") {
        setOpenClearanceForm(data.employee_id);
      } else if (status === "COMPLETED") {
        handleUploadClearanceReportClick(data.id);
        setIsOpen(false)
        reloadData(true)
      }
      else if (status === "EXIT_INTERVIEW") {
        setOpenexitInterviewForm(true);
        setExitData(data)
      }
    },
    [setOpenClearanceForm, handleSubmit, setCurrentItemId]
  );

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getApplicantsData(id);
      if (isMounted) return response;
    } catch (error) {
      console.error("Error fetching exit data:", error);
    }
    return null; // Always return something
  };

  const fields = React.useMemo(
    () => [
      ...(ExitDetails(isResignation) || []),
      {
        customContent: true,
        className: "flex flex-wrap justify-end gap-2 my-5",
        renderContent: (data) => {
          console.log(data, 'APPLICATION DATA')
          if (!data) return null;
          if (
            data.status &&
            data.status.toLowerCase() === "new"
          )
            return (<>
              <Button
                variant="outline"
                onClick={(event) => handleClick(event, "resume_bank", data)}
              >
                Resume Bank
              </Button>
              <Button
                variant="success"
                onClick={(event) => handleClick(event, "screened", data)}
              >
                Screened Candidate
              </Button>
              <Button
                variant="destructive"
                onClick={(event) => handleClick(event, "INITIATED", data)}
              >
                Reject
              </Button>
            </>
            );
          if (
            data.clearance_status &&
            data.clearance_status.toLowerCase() === "initiated"
          )
            return (
              <Button
                variant="outline"
                onClick={(event) => handleClick(event, "COMPLETED", data)}
              >
                Complete Clearance
              </Button>
            );
          // Completed clearance - check if exit interview is available
          if (
            data.clearance_status &&
            data.clearance_status.toLowerCase() === "completed"
          ) {
            // Check if this is resignation/termination AND clearance is fully done
            const isExitType = ["RESIGNATION", "TERMINATION"].includes(
              data.exit_category
            );

            const isClearanceCompleted = data?.is_clearance_handover === true; // Your boolean flag

            if (isExitType && isClearanceCompleted) {
              return (
                <div className="space-y-2">
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Exit Interview form is now available.
                  </div>
                  <Button
                    variant="outline"
                    onClick={(event) => handleClick(event, "EXIT_INTERVIEW", data)}
                  >
                    Proceed for Exit Interview
                  </Button>
                </div>
              );
            } else {
              return (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    disabled={true}
                  >
                    Exit Interview
                  </Button>
                  <div className="text-sm text-amber-600">
                    {!isExitType
                      ? "Exit interview not applicable for this clearance type"
                      : "Waiting for all clearance items to be completed"
                    }
                  </div>
                </div>
              );
            }
          }


        },
      },
    ],
    [
      handleClick,
      isResignation,
      forceLoad,
      setForceLoad,
    ]
  );

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Application Details`}
        currentItem_Id={currentId}
        ForceItemLoad={forceLoad}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
      >
        <DetailContent fields={fields} />
      </NavigationSheetComponent>
      {openClearanceForm && (
        <ClearanceSheet
          isOpen={Boolean(openClearanceForm)}
          setIsOpen={() => {
            setOpenClearanceForm(null);
            setForceLoad(!forceLoad);
          }}
          employee_id={openClearanceForm}
          exit_id={currentItemId}
        />
      )}
      {openexitInterviewForm && (
        <UploadExitInterviewDetails
          isOpen={openexitInterviewForm}
          setIsOpen={() => {
            setOpenexitInterviewForm(false);
            setForceLoad(!forceLoad);
            setExitData(null);
          }}
          exit_id={currentItemId}
          exitData={exitData}
        />
      )}
    </>
  );
};

export default ViewApplicationDetail;
