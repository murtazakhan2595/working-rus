import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions } from "data/Data";
import { EmployeeOverview, StatusLabel, OverviewCard } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import moment from "moment";
import { formatNumber } from "utils/renderValues";
import { AiOutlineDownload } from "react-icons/ai";
import {
  LeaveTrackerActions,
  LeaveDurationAction,
  LeaveTypeAction
} from "app/modules/LeaveTracker";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import { DepartmentName } from "utils/getValuesFromTables";
import { Switch } from "src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Clock, MapPin, Tag } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
import DropdownActionMenu from "components/DropdownActionMenu";
import { getAssetById } from "app/hooks/assets";
import { toast } from "react-toastify";
import { renderDate } from "utils/renderValues";

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

export const MyLeaveAplicationColumns = (realoadData = () => {}) => [
  {
    dataField: "employee_id",
    text: "Leave Type",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showDepartment={true}
        showBranchName={true}
        showId={true}
      />
    ),
  },
  {
    dataField: "",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-col">
        <span>
          {renderDate(cell, "--", "month-day")} -{" "}
          {renderDate(row?.leave_request?.end_date, "--", "month-day")}
        </span>
        <span>{row?.leave_request?.no_of_days} Days</span>
      </div>
    ),
  },
  {
    dataField: "component_name",
    text: "Days",
  },
  {
    dataField: "component_name",
    text: "Leave Duration",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => <StatusLabel status={cell}>{cell}</StatusLabel>,
  },
  {
    text: "",
    dataField: "",
    formatter: (_, row, dataList) => (
      <LeaveTrackerActions
        data={row}
        realoadData={realoadData}
        DataList={dataList}
      />
    ),
  },
];

export const LeaveDurationColumn = (reload, data) => [
  {
    dataField: "duration_name",
    text: "Duration Name",
    dataSort: true,
  },
  {
    dataField: "duration_hours",
    text: "Duration Hours",
    dataSort: true,
  },
  {
    dataField: "nationalities",
    text: "Nationalities",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return <span className="">All</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((nationality) => (
            <span
              key={nationality}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {nationality}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "branches",
    text: "Branches",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return <span className="">All</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((branch) => (
            <span
              key={branch.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {branch.branch_name}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "departments",
    text: "Departments",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return <span className="">All</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((dep) => (
            <span
              key={dep.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {dep.name}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => (
      <LeaveDurationAction
        data={row}
        reload={reload}
        leaveDurationList={data}
      />
    ),
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];

export const PublicHolidaydsColumn = (reload, data) => [
  {
    dataField: "duration_name",
    text: "Duration Name",
    dataSort: true,
  },
  {
    dataField: "duration_hours",
    text: "Duration Hours",
    dataSort: true,
  },
  {
    dataField: "nationalities",
    text: "Nationalities",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return <span className="">All</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((nationality) => (
            <span
              key={nationality}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {nationality}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "branches",
    text: "Branches",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return <span className="">All</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((branch) => (
            <span
              key={branch.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {branch.branch_name}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "departments",
    text: "Departments",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return <span className="">All</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((dep) => (
            <span
              key={dep.id}
              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {dep.name}
            </span>
          ))}
        </div>
      );
    },
    dataSort: true,
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => (
      <LeaveDurationAction
        data={row}
        reload={reload}
        leaveDurationList={data}
      />
    ),
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];

export const LeaveTypesColumns = (reload, data) => [
  {
    dataField: "name",
    text: "Leave Type Name",
    dataSort: true,
  },
  {
    dataField: "short_code",
    text: "Short Code",
    dataSort: true,
  },
  {
    dataField: "leave_count",
    text: "Leave Count",
    dataSort: true,
    style: { textAlign: "center" },
  },
  {
    dataField: "day_count_type",
    text: "Day Type",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell === "work_days"
            ? "bg-blue-100 text-blue-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {cell === "work_days" ? "Work Days" : "Calendar Days"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "max_consecutive_days",
    text: "Max Days",
    dataSort: true,
  },
  {
    dataField: "is_carry_forward_allowed",
    text: "Carry Forward",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell ? "bg-green-100 text-green-800" : "bg-[#fee2e2] text-red-800"
        }`}
      >
        {cell ? "Yes" : "No"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "is_encashable",
    text: "Encash",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell ? "bg-green-100 text-green-800" : "bg-[#fee2e2] text-red-800"
        }`}
      >
        {cell ? "Yes" : "No"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "Applicable For",
    text: "Applicable For",
    formatter: (cell, row) => {
      const {
        nationalities = [],
        branches = [],
        departments = [],
        genders = [],
        marital_statuses = [],
      } = row;

      const applicableItems = [];

      // Nationalities
      applicableItems.push({
        label: "Nationalities",
        values:
          nationalities.length === 0 ? ["All Nationalities"] : nationalities,
        isAll: nationalities.length === 0,
      });

      // Branches
      applicableItems.push({
        label: "Branches",
        values:
          branches.length === 0
            ? ["All Branches"]
            : branches.map((branch) => branch.branch_name),
        isAll: branches.length === 0,
      });

      // Departments
      applicableItems.push({
        label: "Departments",
        values:
          departments.length === 0
            ? ["All Departments"]
            : departments.map((dept) => dept.name),
        isAll: departments.length === 0,
      });

      // Genders
      applicableItems.push({
        label: "Genders",
        values: genders.length === 0 ? ["All Genders"] : genders,
        isAll: genders.length === 0,
      });

      // Marital Status
      applicableItems.push({
        label: "Marital Status",
        values:
          marital_statuses.length === 0
            ? ["All Marital Status"]
            : marital_statuses,
        isAll: marital_statuses.length === 0,
      });

      return (
        <div className="flex flex-col gap-1">
          {applicableItems.map((item, index) => (
            <div key={index} className="flex flex-wrap gap-1">
              <span className="text-xs font-medium mr-1">{item.label}:</span>
              {item.values.map((value, valueIndex) => (
                <span
                  key={valueIndex}
                  className={`inline-block px-2 py-1 text-xs rounded-full bg-[#f0f9ff] text-[#0369a1]`}
                >
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => (
      <span
        className={`inline-block px-2 py-1 text-xs rounded-full ${
          cell ? "bg-green-100 text-green-800" : "bg-[#fee2e2] text-red-800"
        }`}
      >
        {cell ? "Active" : "Inactive"}
      </span>
    ),
    dataSort: true,
  },
  {
    dataField: "actions",
    text: "Actions",
    isDummyField: true,
    formatter: (cell, row) => (
      <LeaveTypeAction data={row} reload={reload} leaveTypeList={data} />
    ),
    headerStyle: { width: "8%" },
  },
];
