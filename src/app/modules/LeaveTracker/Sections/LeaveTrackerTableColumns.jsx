import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { EmployeeOverview, StatusLabel, MultiStatusLabel } from "components";
import {
  LeaveTrackerActions,
  LeaveDurationAction,
  LeaveTypeAction,
  HolidayActions,
  OpeningBalanceAction,
  MyLeavesAction,
  LeaveCountAction,
  OffsetLeaveSettingAction,
} from "app/modules/LeaveTracker";
import {
  DepartmentName,
  DesignationName,
  BranchName,
} from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";

export const LeaveRecordColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
    width:'110px',
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
  {
    dataField: "department_position",
    text: "Designation",
    formatter: (cell) => <DesignationName value={cell} />,
  },
  {
    dataField: "branch_id",
    text: "Branch",
    formatter: (cell) => <BranchName value={cell} />,
  },
  {
    dataField: "",
    text: "",
    formatter: (_, row, dataList) => (
      <LeaveCountAction data={row} DataList={dataList} />
    ),
  },
];

export const LeaveAplicationColumns = (
  isHistoryView = false,
  reloadData = () => {}
) => [
  {
    dataField: "employee",
    text: "Employee",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showDepartment={true}
        showBranchName={true}
        showId={true}
      />
    ),
    dataSort: true,
  },
  {
    dataField: "leave_type_name",
    text: "Leave Type",
  },
  {
    dataField: "start_date",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-row flex-wrap">
        <span>
          {renderDate(cell, "--")} - {renderDate(row.end_date, "--")}
        </span>
        {/* <span>{row?.total_days} Days</span> */}
      </div>
    ),
    minWidth: "120px",
    dataSort: true,
  },
  {
    dataField: "total_days",
    text: "Days",
  },
  {
    dataField: "leave_duration_name",
    text: "Leave Duration",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      const status = row.is_cancelled ? "Cancelled" : cell;
      return <StatusLabel status={status}>{status}</StatusLabel>;
    },
  },
  {
    text: "",
    dataField: "",
    formatter: (_, row, dataList) => (
      <LeaveTrackerActions
        data={row}
        isHistoryView={isHistoryView}
        reloadData={reloadData}
        DataList={dataList}
      />
    ),
  },
];

export const LeaveAplicationDashboardColumns = [
  {
    dataField: "employee",
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

  {
    dataField: "start_date",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-col gap-2">
        <span>{row?.leave_type_name}</span>
        <span>
          {renderDate(cell, "--")} - {renderDate(row.end_date, "--")}
        </span>
        <span>{row?.total_days} Days</span>
      </div>
    ),
    minWidth: "120px",
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      const status = row.is_cancelled ? "Cancelled" : cell;
      return <StatusLabel status={status}>{status}</StatusLabel>;
    },
  },
];
export const MyLeaveApplicationDashboard = [
  {
    dataField: "leave_type_name",
    text: "Leave Type",
  },
  {
    dataField: "start_date",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-col gap-2">
        <span>
          {renderDate(cell, "--")} - {renderDate(row.end_date, "--")}
        </span>
        <span>{row?.total_days} Days</span>
      </div>
    ),
    minWidth: "120px",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      const status = row.is_cancelled ? "Cancelled" : cell;
      return <StatusLabel status={status}>{status}</StatusLabel>;
    },
  },
];
export const MyLeaveAplicationColumns = (realoadData = () => {}) => [
  {
    dataField: "leave_type_name",
    text: "Leave Type",
  },
  {
    dataField: "start_date",
    text: "Leave Period",
    formatter: (cell, row) => (
      <div className="flex flex-col">
        <span>
          {renderDate(cell, "--")} - {renderDate(row.end_date, "--")}
        </span>
        {/* <span>{row?.total_days} Days</span> */}
      </div>
    ),
    dataSort: true,
  },
  {
    dataField: "total_days",
    text: "Days",
  },
  {
    dataField: "leave_duration_name",
    text: "Leave Duration",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      const status = row.is_cancelled ? "Cancelled" : cell;
      return <StatusLabel status={status}>{status}</StatusLabel>;
    },
  },

  {
    text: "",
    dataField: "",
    formatter: (_, row, dataList) => (
      <MyLeavesAction
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
    formatter: (cell) => (
      <MultiStatusLabel
        statusList={cell}
        variant="info"
        fallBackText="All Nationalities"
      />
    ),
    dataSort: true,
  },
  {
    dataField: "branches",
    text: "Branches",
    // formatter: (cell) => {
    //   if (!cell || cell.length === 0) {
    //     return <span className="">All</span>;
    //   }
    //   return (
    //     <div className="flex flex-wrap gap-1">
    //       {cell.map((branch) => (
    //         <span
    //           key={branch.id}
    //           className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
    //         >
    //           {branch.branch_name}
    //         </span>
    //       ))}
    //     </div>
    //   );
    // },
    formatter: (cell) => {
      const branches = cell.map((branch) => branch.branch_name);
      return (
        <MultiStatusLabel
          statusList={branches}
          variant="info"
          fallBackText="All Branches"
        />
      );
    },
    dataSort: true,
  },
  {
    dataField: "departments",
    text: "Departments",
    // formatter: (cell) => {
    //   if (!cell || cell.length === 0) {
    //     return <span className="">All</span>;
    //   }
    //   return (
    //     <div className="flex flex-wrap gap-1">
    //       {cell.map((dep) => (
    //         <span
    //           key={dep.id}
    //           className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
    //         >
    //           {dep.name}
    //         </span>
    //       ))}
    //     </div>
    //   );
    // },
    formatter: (cell) => {
      const departments = cell.map((dpt) => dpt.name);
      return (
        <MultiStatusLabel
          statusList={departments}
          variant="info"
          fallBackText="All Departments"
        />
      );
    },
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
    dataField: "name",
    text: "Holiday Name",
    dataSort: true,
    minWidth: "120px",
  },
  {
    dataField: "date",
    text: "Start date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
    minWidth: "125px",
  },
  {
    dataField: "end_date",
    text: "End date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
    minWidth: "125px",
  },
  {
    dataField: "country",
    text: "Countries",
    formatter: (cell) => {
      return (
        <MultiStatusLabel
          statusList={cell}
          variant="info"
          fallBackText="All Countries"
        />
      );
    },
  },
  {
    dataField: "branch_names",
    text: "Branches",
    formatter: (cell) => (
      <MultiStatusLabel
        statusList={cell}
        variant="info"
        fallBackText="All Branches"
      />
    ),
  },
  {
    dataField: "",
    text: "Actions",
    isDummyField: true,
    formatter: (_, row, dataList) => (
      <HolidayActions data={row} reloadData={reload} DataList={dataList} />
    ),
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];
export const OpeningLeaveBalanceColumn = (reload, data) => [
  {
    dataField: "employee_username",
    text: "Employee ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "employee",
    text: "Employee",
  },
  {
    dataField: "leave_balances",
    text: "Leave Balances",
    formatter: (cell) => (
      <div className="flex flex-col gap-1">
        {cell && cell.length > 0 ? (
          cell.map((balance, index) => (
            <div key={index}>
              <span className="text-sm">{balance.leave_type}: </span>
              <span className="text-blue-600 text-sm">
                Alloted: {balance.total_allotted}, Consumed: {balance.consumed}, Remaining:{" "}
                {balance.remaining}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No leave balances</span>
        )}
      </div>
    ),
  },
  {
    dataField: "",
    text: "Actions",
    isDummyField: true,
    formatter: (_, row, dataList) => (
      <OpeningBalanceAction
        data={row}
        reloadData={reload}
        DataList={dataList}
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

export const LeaveOffsetSettingColumn = (reload, data) => [
  {
    dataField: "nationalities",
    text: "Nationalities",
    formatter: (cell) => {
      return (
        <MultiStatusLabel
          statusList={cell}
          variant="info"
          fallBackText="All Nationalities"
        />
      );
    },
  },
  {
    dataField: "branches_name: null",
    text: "Branches",
    formatter: (cell) => (
      <MultiStatusLabel
        statusList={cell}
        variant="info"
        fallBackText="All Branches"
      />
    ),
  },
  {
    dataField: "departments_name",
    text: "Departments",
    formatter: (cell) => (
      <MultiStatusLabel
        statusList={cell}
        variant="info"
        fallBackText="All Departments"
      />
    ),
  },
  {
    dataField: "grades_name",
    text: "Grades",
    formatter: (cell) => (
      <MultiStatusLabel
        statusList={cell}
        variant="info"
        fallBackText="All Grades"
      />
    ),
  },
  {
    dataField: "validity_months",
    text: "Validity Months",
    dataSort: true,
  },
  {
    dataField: "conversion_ratio_hours",
    text: "Convertion Hours",
    dataSort: true,
  },
  {
    dataField: "",
    text: "Actions",
    isDummyField: true,
    formatter: (_, row, dataList) => (
      <OffsetLeaveSettingAction
        data={row}
        reloadData={reload}
        DataList={dataList}
      />
    ),
    headerStyle: { width: "8%" },
    style: { textAlign: "center" },
  },
];
