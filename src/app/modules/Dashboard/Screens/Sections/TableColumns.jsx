import FormateLeaveTrackerName from "app/modules/Dashboard/Screens/FormateLeaveTrackerName";
import {
  EmployeeID,
  ManagerName,
  LeaveType,
  LeaveTypeOfEmployee,
  UserRole,
} from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions, formatNumber } from "data/Data";
import { EmployeeNameInfo, StatusLabel } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
// import {
//   Status,
//   RenderStatus,
//   RenderLeaveType,
//   RenderLeaveAction,
// } from "app/modules/LeaveManagment/Sections";
import { RenderJobTitle } from "app/modules/Dashboard/Screens/TalentSphere/Sections";
import moment from "moment";
// import RenderEmployeesLeaveAllotement from "app/modules/LeaveManagment/Screens/RenderEmployeesLeaveAllotement";

import { Link as ExLink } from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { DesignationName } from "utils/getValuesFromTables";
import { Button } from "components/ui/button";
export const DashboardJobApplicationColumns = (navigate) => [
  {
    dataField: "id",
    text: "Open Jobs",
    formatter: (cell, row) => <RenderJobTitle row={row} />,
  },

  {
    dataField: "Job_Title",
    text: "Applications",
    formatter: (cell, row) => <div className="">{cell}</div>,
  },
  {
    dataField: "Deadline",
    text: "Timeline",
    formatter: (cell, row) => (
      <>
        {moment(row?.created_at).format("DD MMM")}-{" "}
        {moment(row?.Deadline).format("DD MMM")}
      </>
    ),
  },
  {
    dataField: "id",
    text: "Links",
    formatter: (cell, row, list) => (
      <Button
        variant="outline"
        className="rounded-sm base-text-color"
        size="sm"
        onClick={() => navigate(`/job-description/${cell}`)}
      >
        <ExLink size={16} className="mr-1" />
        View
      </Button>
    ),
  },
];
export const DashboardOnGoingColumns = (navigate) => [
  {
    dataField: "full_name",
    text: "Name",
    formatter: (cell, row) => (
      <div>
        <p>{row.job_title}</p>
        <p className="text-neutral-900 font-semibold">{cell}</p>
      </div>
    ),
    // formatter: (cell, row) => <EmployeeNameInfo row={row} />,
  },
  // {
  //   dataField: "job_title",
  //   text: "Job Title",
  //   formatter: (cell, row) => <RenderJobTitle row={row} />,
  // },
  {
    dataField: "application_status",
    text: "Application Status",
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs flex items-center">
        {cell}
      </Badge>
    ),
    // formatter: ({ value }) => (
    //   <Badge variant="outline" className="text-xs">
    //     {value}
    //   </Badge>
    // ),
  },
];

export const DashboardLeaveTrackerColumns = [
  {
    dataField: "id",
    text: "Employee",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.name}`}
        department={row.department_name}
        position={row.position}
        showPosition={false}
      />
    ),
    width: "30%",
  },
  {
    dataField: "id",
    text: "Designation",
    formatter: (cell, row) => <DesignationName value={row?.position} />,
  },
  {
    dataField: "status_hr",
    text: "Status",
    // formatter: (cell) => <StatusLabel status={Status(cell)} />,
  },
  {
    dataField: "date",
    text: "Date",
    formatter: (cell, row) => (
      <div className="text-[#5c5e64] text-sm font-normal  leading-[18px]">
        {moment(row?.start_date).format("DD MMM")} -{" "}
        {moment(row?.end_date).format("DD MMM")}
      </div>
    ),
  },
];
