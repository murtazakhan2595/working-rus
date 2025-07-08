import { EmployeeAttendenceActions } from "app/modules/Attendance/Sections";
import {
  TimeAdjustmentsActions,
  AttendanceAdjustmentActions,
} from "app/modules/Attendance";
import { calculatePercentage } from "utils/renderValues";
import { EmployeeOverview } from "components";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this
import { formatDuration } from "utils/renderValues";
import moment from "moment";
import { StatusLabelAttendance } from "components/StatusLabel";
import { renderDate, formatNumber } from "utils/renderValues";
import { StatusLabel } from "components";
import { EmployeeUsername, EmployeeName } from "utils/getValuesFromTables";

/**
 * AttendanceColumns
 *
 * Returns an array of column definitions for the Employee table.
 *
 * @returns {array} An array of column definitions.
 */

const getCheckoutTime = (checkIn) => {
  if (!checkIn) return "--";
  const checkInTime = moment(checkIn);
  const now = moment();

  // If 14 hours have passed since check-in, return check-in + 14 hours
  const fourteenHoursLater = moment(checkInTime).add(14, "hours");

  if (now.isAfter(fourteenHoursLater)) {
    return (
      <div>
        {fourteenHoursLater.format("h:mm A")}
        <br />
        (Check-out missing)
      </div>
    );
  }

  // If 14 hours not yet passed, return "Pending"
  return "Working";
};

export const EmployeesAttendanceColumns = (
  TotalDays = 5,
) => [
  {
    dataField: "emp_name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.employee_id}
        showId
        showPosition
        showBranchName
      />
    ),
    dataSort: true,
  },

  {
    dataField: "attendance_stats",
    text: "Present Days",
    formatter: (cell, row) => <span>{parseInt(cell?.Present)}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Absent Days",
    formatter: (cell) => (
      <span>{parseInt(TotalDays) - parseInt(cell?.Present)}</span>
    ),
  },
  {
    dataField: "attendance_stats",
    text: "Late Days",
    formatter: (cell) => <span>{cell?.Late}</span>,
  },
  {
    dataField: "productivity_hours",
    text: "Total Productivity Hours",
    formatter: (cell) => <span>{formatDuration(cell)}</span>,
  },
  {
    dataField: "overtime_hours",
    text: "Total Overtime Hours",
    formatter: (cell) => <span>{formatDuration(cell)}</span>,
  },
  {
    dataField: "attendance_stats",
    text: "Attendance %",
    formatter: (cell, row) => {
      const present = parseInt(cell.Present) || 0;
      const percentage = calculatePercentage(present, TotalDays);
      return (
        <div className="flex justify-between gap-1">
          {`${percentage.toFixed(0)}%`}
          <Progress value={percentage} className="mt-1 h-2 bg-gray-400" />
        </div>
      );
    },
  },
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => <EmployeeAttendenceActions row={row} />,
  },
];

export const MyAttendanceColumn = (reload) => [
  {
    text: "Date",
    dataField: "date",
    formatter: (cell) => <>{`${renderDate(cell)}`} </>,
  },
  {
    text: "Check In",
    dataField: "checkin",
    formatter: (cell, row) => (
      <div className="flex-col flex gap-1">
        <span>{moment(cell).format("h:mm A")}</span>
        <span>
          {row.second_checkin
            ? moment(row.second_checkin).format("h:mm A")
            : ""}
        </span>
      </div>
    ),
  },
  {
    text: "Check Out",
    dataField: "checkout",
    formatter: (cell, row) => {
      return (
        <div className="flex-col flex gap-2">
          {cell ? (
            <span>{moment(cell).format("h:mm A")}</span>
          ) : (
            getCheckoutTime(row.checkin, cell)
          )}
          {row.second_checkin ? (
            row.second_checkout ? (
              <span>{moment(row.second_checkout).format("h:mm A")}</span>
            ) : (
              getCheckoutTime(row.second_checkin, row.second_checkout)
            )
          ) : (
            ""
          )}
        </div>
      );
    },
  },
  {
    text: "Break",
    dataField: "break_duration",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  {
    text: "Overtime",
    dataField: "overtime_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Total Shift Hours",
    dataField: "total_hours",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  {
    text: "Productivity",
    dataField: "payable_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Remaining Hours",
    dataField: "total_hours",
    formatter: (cell, row) => {
      if (!row.checkout) return "--";
      const remaining_hours = Math.max(
        0,
        (cell ?? 0) - (row.payable_hours ?? 0)
      );
      return formatDuration(remaining_hours);
    },
  },

  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => <StatusLabelAttendance status={cell} />,
  },
  // {
  //   dataField: "",
  //   text: "Actions",
  //   formatter: (cell, row) => (
  //     <MyAttendenceActions data={row} reload={reload} />
  //   ),
  // },
];

export const AttendanceReportColumns = [
  {
    text: "Date",
    dataField: "date",
    formatter: (cell) => <>{`${renderDate(cell)}`}</>,
  },
  {
    text: "Check In",
    dataField: "checkin",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Check Out",
    dataField: "checkout",
    formatter: (cell, row) => {
      return cell ? (
        <span>{moment(cell).format("h:mm A")}</span>
      ) : (
        getCheckoutTime(row.checkin, cell)
      );
    },
  },
  {
    text: "Break",
    dataField: "break_duration",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  {
    text: "Overtime",
    dataField: "overtime_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Productivity",
    dataField: "payable_hours",
    formatter: (cell, row) => <>{row.checkout ? formatDuration(cell) : "--"}</>,
  },
  {
    text: "Total Hours",
    dataField: "total_hours",
    formatter: (cell) => <>{formatDuration(cell)}</>,
  },
  { text: "Status", dataField: "status" },
];

export const TimeAdjustmentsColumns = (viewMode = false, reloadData) => [
  {
    text: "Employee",
    dataField: "employee_id",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showId={true}
        showDepartment={true}
        showBranchName={true}
      />
    ),
  },
  {
    text: "Date",
    dataField: "date",
    formatter: (cell) => <>{`${renderDate(cell)}`}</>,
  },
  {
    text: "Check In",
    dataField: "checkin_time",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Submission Time",
    dataField: "created_at",
    formatter: (cell) => `${renderDate(cell, "--", "date-time")}`,
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => (
      <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    ),
  },
  {
    text: "",
    dataField: "",
    formatter: (cell, row, dataList) => (
      <TimeAdjustmentsActions
        data={row}
        reloadData={reloadData}
        TimeAdjustmentList={dataList}
      />
    ),
  },
];
export const AttendanceAdjustmentsColumns = (viewMode = false, reloadData) => [
  {
    text: "Employee",
    dataField: "employee",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showId={true}
        showDepartment={true}
        showBranchName={true}
      />
    ),
  },
  {
    text: "Attendance Date",
    dataField: "attendance_date",
    formatter: (cell) => <>{`${renderDate(cell)}`}</>,
  },
  {
    text: "Requested Check-In",
    dataField: "requested_checkin",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Requested Check-Out",
    dataField: "requested_checkout",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => (
      <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    ),
  },
  {
    text: "",
    dataField: "",
    formatter: (cell, row, dataList) => (
      <AttendanceAdjustmentActions
        data={row}
        reloadData={reloadData}
        DataList={dataList}
      />
    ),
  },
];

export const TimeAdjustmentLogsColumns = [
  {
    text: "Date",
    dataField: "date",
    formatter: (cell) => <>{`${renderDate(cell)}`}</>,
  },
  {
    text: "Check In",
    dataField: "checkin",
    formatter: (cell) => <span>{moment(cell).format("h:mm A")}</span>,
  },
  {
    text: "Submission Time",
    dataField: "created_at",
    formatter: (cell) => `${renderDate(cell, "--", "date-time")}`,
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => (
      <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>
    ),
  },
  {
    text: "",
    dataField: "",
    formatter: (_, row) => (
      <TimeAdjustmentsActions data={row} isHistoryView={true} />
    ),
  },
];

export const AttendanceAdjustmentLogsColumns = [
  {
    text: "Employee",
    dataField: "employee",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showId={true}
        showDepartment={true}
        showBranchName={true}
      />
    ),
  },
  {
    text: "Attendance Date",
    dataField: "attendance_date",
    formatter: (cell) => renderDate(cell),
  },
  {
    text: "Updated By",
    dataField: "approver",
    formatter: (cell) => (
      <div className="flex flex-col gap-1">
        <span>
          <EmployeeName value={cell} />
        </span>
        <span className="text-neutral-800 text-xs">
          (<EmployeeUsername value={cell} fallBackText={"--"} />)
        </span>
      </div>
    ),
  },
  {
    text: "Updated On",
    dataField: "modified_at",
    formatter: (cell) => renderDate(cell),
  },
  {
    text: "Action",
    dataField: "approver_action",
    formatter: (cell) => {
      const status = cell ? cell : "pending";
      return <StatusLabel status={status}>{status?.toLowerCase()}</StatusLabel>;
    },
  },
  {
    text: "",
    dataField: "",
    formatter: (_, row, dataList) => (
      <AttendanceAdjustmentActions
        data={row}
        isHistoryView={true}
        DataList={dataList}
      />
    ),
  },
];
export const UserBiometricLogsColumns = [
  {
    text: "Employee",
    dataField: "emp_id",
    formatter: (cell) => (
      <EmployeeOverview
        id={cell}
        showId={true}
        showDepartment={true}
        showBranchName={true}
      />
    ),
  },
  {
    text: "Biometric ID",
    dataField: "user_no",
  },
  {
    text: "Date",
    dataField: "timestamp",
    formatter: (cell) => renderDate(cell, "--"),
  },
  {
    text: "Logtime",
    dataField: "timestamp",
    formatter: (cell) => renderDate(cell, "--", "time"),
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => {
      const status = cell ? cell : "pending";
      return <StatusLabel status={status}>{status?.toLowerCase()}</StatusLabel>;
    },
  },
];
