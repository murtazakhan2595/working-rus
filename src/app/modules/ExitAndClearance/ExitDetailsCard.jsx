import { toast } from "react-toastify";
import React, { useState, useRef } from "react";
import {
  RenderResignationAction,
  RenderTerminationAction,
} from "app/modules/ExitAndClearance/ExitRequests";
import { FormatID } from "utils/getValuesFromTables";
import {
  saveEmployeeExitDetail,
  getEmployeeExitData,
} from "app/hooks/employeeExitAndClearance";
import { useSelector } from "react-redux";
import {
  UploadClearanceReport,
  ClearanceSheet,
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
import { HasAccess } from "utils/PermissionUtils";
import AttachmentUI from "components/ui/AttachmentUI";

export const ExitDetails = (isResignation) => [
  {
    customContent: true,
    renderContent: (data) => {
      return (
        <div className="flex flex-wrap justify-between gap-2 items-center">
          <EmployeeOverview
            id={data.employee_id}
            howId={true}
            showEmail={true}
            avatarSize={14}
          />
          <div className="flex justify-end gap-2 flex-wrap">
            <StatusLabel status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
            {data?.status?.toLowerCase() === "approved" && (
              <StatusLabel status={data.clearance_status}>
                Clearance {data?.clearance_status?.toLowerCase()}
              </StatusLabel>
            )}
          </div>
        </div>
      );
    },
  },
  {
    title: "Employee Details",
    field: [
      {
        key: "employee_id",
        label: "",
        formatter: (cell) => (
          <EmployeeDetailUI
            id={cell}
            InformationKeys={[
              "name",
              "department",
              "position",
              "branch",
              "manager",
              "contact_no",
              "employment_type",
              "joining_date",
            ]}
            ViewVariant={"vertical"}
            className
          />
        ),
      },
    ],
  },
  {
    title: `${isResignation ? "Resignation" : "Termination"} Details`,
    footerTitle: "Request At",
    footerField: "created_at",
    field: [
      {
        key: "id",
        label: "Id",
        formatter: (cell, row) => <FormatID value={cell} prefix={"EXT-"} />,
      },
      {
        key: isResignation ? "exit_type" : "reason_of_termination",
        label: "Reason for leaving",
        // formatter: (cell) => renderDate(cell),
      },
      {
        key: "notice_period",
        label: "Notice Period",
        // formatter: (cell) => renderDate(cell),
      },
      {
        key: "exit_date",
        label: "Exit date",
        formatter: (cell) => renderDate(cell, "--"),
      },
    ],
  },
  {
    title: `${isResignation ? "Resignation" : "Termination"} Letter`,
    field: [
      {
        key: isResignation ? "resignation_letter" : "termination_letter",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`${data.emp_name || data.serial_number} ${
                isResignation ? "Resignation" : "Termination"
              } Letter`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">No letter attached</div>
          ),
      },
    ],
  },
  {
    title: `Clearance Report`,
    field: [
      {
        key: "clearance_report",
        formatter: (cell, data) =>
          cell ? (
            <AttachmentUI
              attachment={cell}
              name={`${data.emp_name || data.serial_number} Clearance Report`}
              viewOnly={true}
            />
          ) : (
            <div className="text-neutral-1000 text-sm">No report attached</div>
          ),
      },
    ],
  },
  {
    title: `Exit Interview Details`,
    field: [
      {
        key: "exit_interviewer_name",
        label: "Interviewer Name",
      },
      {
        key: "exit_interview_date",
        label: "Interview date",
        formatter: (cell) => renderDate(cell, "--"),
      },
      {
        key: "exit_interview_notes",
        label: "Interview Notes",
      },
    ],
  },
  {
    title: "Approval Details",
    field: [
      {
        key: "approval_details",
        formatter: (cell) => <StatusList status_list={cell} className="my-3" />,
      },
    ],
  },
];

const ExitDetailsCard = ({
  currentId,
  isResignation = true,
  DataList = [],
  reloadData = () => {},
  isOpen,
  setIsOpen = () => {},
}) => {
  const managePermitted = HasAccess("MANAGE_EXIT_REQUESTS");
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );
  const [forceLoad, setForceLoad] = useState(false);
  const [openClearanceForm, setOpenClearanceForm] = useState(false);
  const [openUploadClearanceRportForm, setOpenUploadClearanceReportForm] =
    useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const handleSubmit = async (
    status,
    {
      employee,
      id,
      rejection_reason,
      request,
      requested_checkout,
      requested_checkin,
      is_second_shift,
      attendance_date,
    }
  ) => {
    try {
      const response = await handleRequest(request, status === "Approved");
      // return
      if (response) {
        toast.success(`Request ${status} Successfully!`);

        setForceLoad(!forceLoad);
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    }
  };

  const handleClick = React.useCallback(
    (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      setCurrentItemId(data.id);
      if (status === "INITIATED") {
        setOpenClearanceForm(data.employee_id);
      } else if (status === "COMPLETED") {
        setOpenUploadClearanceReportForm(true);
      }
    },
    [setOpenClearanceForm, handleSubmit, setCurrentItemId]
  );

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getEmployeeExitData(id);
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
          if (!data) return null;
          if (data.status && data.status?.toLowerCase() === "approved") {
            if (
              data.clearance_status &&
              data.clearance_status.toLowerCase() === "pending"
            )
              return (
                <Button
                  variant="outline"
                  onClick={(event) => handleClick(event, "INITIATED", data)}
                >
                  Initiate Clearance
                </Button>
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
          }
          return (
            <StatusButtons
              permissionKey={"MANAGE_EXIT_REQUESTS"}
              status={data?.status || null}
              current_approver={data?.current_approver || null}
              request_id={data.request}
              setResponse={(reponse, status) => {
                if (reponse) {
                  toast.success(`Request ${status} Successfully!`);
                  setForceLoad(!forceLoad);
                }
              }}
            ></StatusButtons>
          );
          if (!managePermitted) return null;
          if (!data || !data.status || data.status?.toLowerCase() !== "pending")
            return null;
          if (!data.current_approver) return null;
          if (data.current_approver.includes(user_id) || user_role.includes(1))
            return (
              <div className="">
                <Button
                  variant="success"
                  onClick={(event) => handleClick(event, "Approved", data)}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={(event) => handleClick(event, "Rejected", data)}
                >
                  Reject
                </Button>
              </div>
            );
          return null;
        },
      },
    ],
    [
      managePermitted,
      user_id,
      user_role,
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
        title={`${isResignation ? "Resignation" : "Termination"} Details`}
        currentItem_Id={currentId}
        ForceItemLoad={forceLoad}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
        deleteItemName="name"
        editTooltip="Edit Grace Time"
        deleteTooltip="Delete Geace Time"
      >
        <DetailContent title="Adjustment Details" fields={fields} />
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
      {openUploadClearanceRportForm && (
        <UploadClearanceReport
          isOpen={openUploadClearanceRportForm}
          setIsOpen={() => {
            setOpenUploadClearanceReportForm(false);
            setForceLoad(!forceLoad);
          }}
          exit_id={currentItemId}
        />
      )}
    </>
  );
};

export default ExitDetailsCard;
