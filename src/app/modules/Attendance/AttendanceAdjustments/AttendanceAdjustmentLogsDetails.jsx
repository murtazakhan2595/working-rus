import React from "react";
import {
  NavigationSheetComponent,
  DetailContent,
  StatusList,
} from "components";
// import AddGraceTimeForm from "./AddGraceTimeForm";
import { FormatID } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { getAttendanceAdjustmentLogsData } from "app/hooks/attendance";
import { EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveTimeAdjustment } from "app/hooks/attendance";
import { EmployeeDetailUI } from "components";
import { EmployeeUsername } from "utils/getValuesFromTables";
import { EmployeeInfo } from "utils/getValuesFromTables";

const AttendanceAdjustmentLogsDetails = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  const { id: user_id, role: user_role } = useSelector(
    (state) => state.user.userProfile
  );

  // Define the fields to display
  const fields = [
    {
      customContent: true,
      renderContent: (data) => {
        return (
          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex justify-between gap-2 item-center flex-wrap">
              <EmployeeOverview
                id={data.employee}
                showId={true}
                showEmail={true}
                avatarSize={16}
              />
              <StatusLabel className="ml-10" status={data.status}>
                {data?.status?.toLowerCase()}
              </StatusLabel>
            </div>
          </div>
        );
      },
    },
    {
      title: "Employee Details",
      field: [
        {
          key: "employee",
          label: "",
          formatter: (cell, row) => (
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
      title: "Attendance Details",
      footerTitle: "Request At",
      footerField: "request_datetime",
      field: [
        {
          key: "attendance_date",
          label: "Attendance Date",
          formatter: (cell) => renderDate(cell),
        },
        {
          key: "original_status",
          label: "Status",
          formatter: (cell, data) => `${cell} -> ${data?.updated_status}`,
        },
        {
          key: "original_checkin",
          label: "Check-In",
          formatter: (cell, data) =>
            `${renderDate(cell, "--", "time")} -> ${renderDate(
              data?.updated_checkin,
              "--",
              "time"
            )}`,
        },
        {
          key: "original_checkout",
          label: "Check-Out",
          formatter: (cell, data) =>
            `${renderDate(cell, "--", "time")} -> ${renderDate(
              data?.updated_checkout,
              "--",
              "time"
            )}`,
        },
      ],
    },
    {
      title: "Approver Details",
      field: [
        {
          key: "approval_level",
          label: "Approval Level",
        },
        {
          key: "approver_action",
          label: "Approval Action",
        },
        {
          key: "approver",
          label: "Updated By",
          formatter: (cell) => (
            <>
              <EmployeeUsername value={cell} /> {"-"}{" "}
              <EmployeeInfo value={cell} label={"department_position"} />
            </>
          ),
        },
        {
          key: "modified_at",
          label: "Updated At",
          formatter: (cell) => renderDate(cell, "--", "date-time"),
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getAttendanceAdjustmentLogsData(id);
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
      title="Attendance Adjustment Details"
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
  );
};

export default AttendanceAdjustmentLogsDetails;
