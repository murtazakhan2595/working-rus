import React, { useState } from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel, EmployeeDetailUI } from "components";
import { getTimeAdjustmentData } from "app/hooks/attendance";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HasAccess } from "utils/PermissionUtils";
import { handleRequest } from "app/hooks/general";

const TimeAdjustmentDetails = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  const managePermitted = HasAccess("MANAGE_TIME_ADJ_REQUESTS");
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );
  const [forceLoad, setForceLoad] = useState(false);

  const handleClick = async (event, status, { request }) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await handleRequest(request, status === "Approved");
      if (response) {
        toast.success(`Request ${status} Successfully!`);
        setForceLoad(!forceLoad);
      }
    } catch (error) {
      // Handle errors and rollback form data
      console.error(error);
    }
  };
  // Define the fields to display
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="flex flex-wrap justify-between gap-2 flex-wrap items-center">
            <EmployeeOverview
              id={data.employee_id}
              showId={true}
              showEmail={true}
              avatarSize={14}
            />
            <StatusLabel className="ml-10" status={data.status}>
              {data?.status?.toLowerCase()}
            </StatusLabel>
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
              ]}
              ViewVariant={"vertical"}
              className
            />
          ),
        },
      ],
    },
    {
      title: "Adjustment Details",
      footerTitle: "Submitted At",
      footerField: "created_at",
      field: [
        {
          key: "date",
          label: "Attendance Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "checkin_time",
          label: "Check-In Time",
          formatter: (cell) => renderDate(cell, "--", "time"),
        },
        {
          key: "shift_start_time",
          label: "New Shift Hours",
          formatter: (cell, data) => (
            <>
              {renderDate(cell, "--", "time")} -{" "}
              {renderDate(data?.shift_end_time, "--", "time")}
            </>
          ),
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
        if (!managePermitted) return null;
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
                onClick={(event) => handleClick(event, "Rejected", data)}
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
      const response = await getTimeAdjustmentData(id);
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Time Adjustment Details"
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
      <DetailContent title="Adjustment Time Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default TimeAdjustmentDetails;
