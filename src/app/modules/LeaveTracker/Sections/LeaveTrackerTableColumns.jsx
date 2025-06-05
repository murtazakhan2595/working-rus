import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions } from "data/Data";
import { EmployeeOverview, StatusLabel, OverviewCard } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import moment from "moment";
import { formatNumber } from "utils/renderValues";
import { AiOutlineDownload } from "react-icons/ai";
import { LeaveTrackerActions } from "app/modules/LeaveTracker";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import { DepartmentName } from "utils/getValuesFromTables";
import { Switch } from "src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Clock, MapPin, Tag } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
import DropdownActionMenu from "components/DropdownActionMenu";
import { getAssetById } from "app/hooks/assets";
import { toast } from "react-toastify";

export const LeaveRecordColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "id",
    text: "Employee",
    formatter: (cell, row) => (
      <>
        <EmployeeOverview id={cell} showEmail={true} />
      </>
    ),
  },
  {
    dataField: "department_name",
    text: "Department",
    formatter: (cell) => <DepartmentName value={cell} />,
  },
  // {
  //   dataField: "used_leaves",
  //   text: "Total Used",
  // },
  // {
  //   dataField: "total_balance_after",
  //   text: "Total Remaining",
  // },
];

export const LeaveTypesColumns = (onCheckedChange) => [
  {
    dataField: "name",
    text: "Leave Type",
  },
  {
    dataField: "max_days",
    text: "Number of Days",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      return (
        <div
          onClick={(event) => {
            // Stop the event propagation to prevent onRowClick from being triggered
            event.stopPropagation();
          }}
        >
          <Switch
            id="Status"
            checked={cell}
            onCheckedChange={(value) => {
              // The event is handled by the div, so no need to stop it here
              onCheckedChange(value, row);
            }}
          />
        </div>
      );
    },
  },
];

export const LeaveAplicationColumns = (
  isHistoryView = false,
  realoadData = () => {}
) => [
  {
    dataField: "employee_id",
    text: "Employee",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showDepartment={true}
        showBranchName={true}
        showId={true}
      />
    ),
  },

  // {
  //   dataField: "",
  //   text: "Department",
  //   formatter: (cell, row) => (
  //     <>
  //       <DepartmentName
  //         value={row?.leave_request?.employee_info?.department_name}
  //       />
  //     </>
  //   ),
  // },
  {
    dataField: "",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-col">
        <span>
          {`${moment(row?.leave_request?.start_date).format(
            "MMM D"
          )} - ${moment(row?.leave_request?.end_date).format("MMM D")}`}
        </span>
        <span>{row?.leave_request?.no_of_days} Days</span>
      </div>
    ),
  },
  // {
  //   dataField: "",
  //   text: "Days",
  //   formatter: (cell, row) => <>{row?.leave_request?.no_of_days}</>,
  // },
  {
    dataField: "component_name",
    text: "Leave Type",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => (
      <span
        className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
          row?.action_hr === "Approved" && row?.action_manager === "Approved"
            ? "bg-emerald-50 text-teal-700"
            : row?.action_hr === "Declined" ||
              row?.action_manager === "Declined"
            ? "bg-red-50 text-red-700"
            : "bg-[#f0f0f3] text-[#7f838d]"
        }`}
      >
        {row?.action_hr === "Approved" && row?.action_manager === "Approved"
          ? "Approved"
          : row?.action_hr === "Declined" || row?.action_manager === "Declined"
          ? "Declined"
          : "Pending"}
      </span>
    ),
  },
  {
    text: "",
    dataField: "",
    formatter: (_, row, dataList) => (
      <LeaveTrackerActions
        data={row}
        isHistoryView={isHistoryView}
        realoadData={realoadData}
        DataList={dataList}
      />
    ),
  },
];
