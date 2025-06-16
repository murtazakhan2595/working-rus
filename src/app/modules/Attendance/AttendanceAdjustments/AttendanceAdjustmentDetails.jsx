import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, SheetUI } from "components";
import { getAttendanceAdjustmentData } from "app/hooks/attendance";
import { handleRequest } from "app/hooks/general";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveUpdateAttendanceAdjustment } from "app/hooks/attendance";
import { TextAreaInput } from "components/FormControl";
import { HasAccess } from "utils/PermissionUtils";

const FormSheetData = {
  triggerText: "Submit",
  title: "Reject Attendance Update Request",
  description: null,
  footer: null,
  className: "max-w-[478px] w-full h-[400px]",
};
const AttendanceAdjustmentDetails = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // const managePermitted = HasAccess("MANAGE_LEAVE_REQUEST");
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [RejectedData, setRejectData] = useState(false);
  const handleSubmit = async (
    status,
    { attendance, employee, id, rejection_reason, request_id }
  ) => {
    try {
      const payload = {
        status: status.toUpperCase(),
        // attendance: attendance,
        employee: employee,
        rejection_reason: rejection_reason,
      };

      // const response = await saveUpdateAttendanceAdjustment(payload, id);
      const response = await handleRequest(request_id, status === "Approved");
      // return
      if (response) {
        toast.success(`Request ${status} Successfully!`);
        fetchData(id, true);
        setOpenRejectModal(false);
        setRejectData(null);
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    }
  };
  const handleClick = (event, status, data) => {
    event.preventDefault();
    event.stopPropagation();
    handleSubmit(status, data);
  };
  const handleRejectClick = (event, data) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenRejectModal(true);
    setRejectData(data);
  };
  // Define the fields to display
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="flex flex-wrap justify-between gap-2 items-center flex-wrap">
            <EmployeeOverview
              id={data.employee}
              showId={true}
              showEmail={true}
              showBranchName={true}
              showDepartment={true}
              avatarSize={16}
            />
            <StatusLabel className="ml-10" status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
          </div>
        );
      },
    },
    {
      title: "Adjustment Details",
      footerTitle: "Request At",
      footerField: "request_datetime",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell, row) => <FormatID value={cell} prefix={"AA-"} />,
        },
        {
          key: "attendance_date",
          label: "Attendance Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "requested_checkin",
          label: "Requested Check-In",
          formatter: (cell) => renderDate(cell, "--", "time"),
        },
        {
          key: "requested_checkout",
          label: "Requested Check-Out",
          formatter: (cell) => renderDate(cell, "--", "time"),
        },
        {
          key: "reason",
          label: "Reason",
        },
      ],
    },
    {
      title: "Approval Details",
      field: [
        {
          key: "approval_details",
          formatter: (cell) => (
            <StatusList status_list={cell} className="my-3" />
          ),
        },
      ],
    },
    {
      customContent: true,
      renderContent: (data) => {
        // if (!managePermitted) return null;
        if (!data || !data.status || data.status?.toLowerCase() !== "pending")
          return null;
        if (!data.current_approver) return null;
        if (data.current_approver.includes(user_id) || user_role.includes(1))
          return (
            <div className="flex flex-wrap justify-end gap-2 my-5">
              <Button
                variant="success"
                onClick={(event) => handleClick(event, "Approved", data)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={(event) => handleRejectClick(event, data)}
              >
                Reject
              </Button>
            </div>
          );
        return null;
      },
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getAttendanceAdjustmentData(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Attendandance Adjustment Details"
        currentItem_Id={currentId}
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
      {openRejectModal && (
        <SheetUI
          isOpen={openRejectModal}
          setIsOpen={setOpenRejectModal}
          variant="modal"
          sheetConfig={FormSheetData}
          formConfig={{
            initialValues: RejectedData,
            enableReinitialize: true,
            handleSubmit: (data) => {
              handleSubmit("Rejected", data);
            },
            validateFormSchema: (values) => {
              const error = {};
              if (!values.rejection_reason)
                error.rejection_reason = "Reason is required";
              return error;
            },
            submitButtonText: "Submit",
            cancelButtonText: "Cancel",
            columns: 1,
            formFields: [
              {
                sheetCardExtension: false,
                sheetCardTitle: "Attendance Details",
                InputFields: [
                  {
                    InputField: TextAreaInput,
                    name: "rejection_reason",
                    required: true,
                    label: "Rejection Reson",
                    rows: 3,
                  },
                ].filter(Boolean),
              },
            ],
          }}
        ></SheetUI>
      )}
    </>
  );
};

export default AttendanceAdjustmentDetails;
