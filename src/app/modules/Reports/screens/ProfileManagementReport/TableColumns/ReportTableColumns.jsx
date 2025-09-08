import React from "react";
import { Badge } from "components/ui/badge";
import { StatusLabel, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { Progress } from "src/@/components/ui/progress";

// Employee Master Report Columns
export const EmployeeMasterColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={true}
        showDepartment={false}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "department_position",
    text: "Designation",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "department_name",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "employee_location",
    text: "Location",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "joining_date",
    text: "Date of Joining",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "salary_type",
    text: "Employment Type",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant={cell === "Full-Time" ? "success" : "info"}>
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "employee_status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel status={cell}>{cell || "Unknown"}</StatusLabel>
    ),
  },
];

// Demographics Report Columns
export const DemographicsColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={false}
        showDepartment={true}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "age",
    text: "Age",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-neutral-1200">
          {cell || "N/A"}
        </span>
      </div>
    ),
  },
  {
    dataField: "gender",
    text: "Gender",
    dataSort: true,
    formatter: (cell) => (
      <Badge
        variant={
          cell === "MALE" ? "info" : cell === "FEMALE" ? "warning" : "neutral"
        }
      >
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "nationality",
    text: "Nationality",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "joining_date",
    text: "Date of Joining",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "tenure",
    text: "Tenure (Months)",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-plum-900">
          {cell || "N/A"}
        </span>
      </div>
    ),
  },
];

// Employee Status Report Columns
export const EmployeeStatusColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={true}
        showDepartment={true}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "employee_status",
    text: "Status",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel status={cell}>{cell || "Unknown"}</StatusLabel>
    ),
  },
  {
    dataField: "current_leave_balance",
    text: "Current Leave Balance",
    dataSort: false,
    formatter: (cell) => (
      <Badge variant="secondary">{cell || "N/A - API Pending"}</Badge>
    ),
  },
  {
    dataField: "joining_date",
    text: "Last Status Change",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
];

// Probation Status Report Columns
export const ProbationStatusColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={true}
        showDepartment={true}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "joining_date",
    text: "Joining Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "probation_end_date",
    text: "Probation End Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "probation_status",
    text: "Probation Status",
    dataSort: true,
    formatter: (cell) => {
      const variants = {
        Ongoing: "warning",
        Completed: "success",
        Extended: "info",
        Terminated: "error",
      };
      return (
        <StatusLabel status={cell} variant={variants[cell] || "neutral"}>
          {cell || "N/A"}
        </StatusLabel>
      );
    },
  },
  {
    dataField: "confirmation_status",
    text: "Confirmation Status",
    dataSort: false,
    formatter: (cell, row) => {
      // Calculate confirmation status based on probation status
      const status =
        row.probation_status === "Completed" ? "Confirmed" : "Pending";
      const variant = status === "Confirmed" ? "success" : "warning";

      return (
        <StatusLabel status={status} variant={variant}>
          {status}
        </StatusLabel>
      );
    },
  },
];

// Document Compliance Report Columns
export const DocumentComplianceColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={true}
        showDepartment={true}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "nationality",
    text: "Nationality",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="outline" className="text-xs">
        {cell || "N/A"}
      </Badge>
    ),
  },
  {
    dataField: "passport_status",
    text: "Passport Status",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary">{cell || "N/A - API Pending"}</Badge>
    ),
  },
  {
    dataField: "visa_status",
    text: "Visa Status",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary">{cell || "N/A - API Pending"}</Badge>
    ),
  },
  {
    dataField: "emirates_id_status",
    text: "Emirates ID Status",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary">{cell || "N/A - API Pending"}</Badge>
    ),
  },
  {
    dataField: "compliance_status",
    text: "Overall Compliance",
    dataSort: true,
    formatter: (cell) => (
      <Badge variant="secondary">{cell || "N/A - API Pending"}</Badge>
    ),
  },
];

// Skills & Qualifications Report Columns
export const SkillsQualificationsColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={true}
        showDepartment={true}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "education",
    text: "Education",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
        <span className="text-sm text-neutral-1000">
          {cell || "N/A"}
        </span>
      </div>
    ),
  },
  {
    dataField: "certifications",
    text: "Certifications",
    dataSort: false,
    formatter: (cell) => (
      <div className="max-w-xs">
      {/* here certfications is array of strings */}
        <span className="text-sm text-neutral-1000">
          {Array.isArray(cell) && cell.length > 0
            ? cell.join(", ")
            : "N/A"}
        </span>
      </div>
    ),
  },
  // to be added in future when API is ready
  // {
  //   dataField: "skills",
  //   text: "Skills",
  //   dataSort: false,
  //   formatter: (cell) => <Badge variant="secondary">N/A - API Pending</Badge>,
  // },
];

// Contact Report Columns
export const ContactReportColumns = () => [
  {
    dataField: "serial_number",
    text: "Employee ID",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "N/A"}</span>
    ),
  },
  {
    dataField: "name",
    text: "Employee Name",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.id}
        showId={false}
        showPosition={false}
        showDepartment={true}
        showBranchName={false}
      />
    ),
  },
  {
    dataField: "emergency_first_name",
    text: "Emergency Contact",
    dataSort: true,
    formatter: (cell, row) => (
      <div>
        <div className="font-medium text-neutral-1200">
          {cell && row.emergency_last_name
            ? `${cell} ${row.emergency_last_name}`
            : "N/A"}
        </div>
        <div className="text-xs text-neutral-800">
          {row.emergency_relation || "N/A"}
        </div>
      </div>
    ),
  },
  {
    dataField: "emergency_phone_no",
    text: "Contact Number",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "N/A"}</span>
    ),
  },
];

// Headcount Report Columns - Updated for new API structure
export const HeadcountColumns = () => [
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "Unknown"}</span>
    ),
  },
  {
    dataField: "location",
    text: "Primary Location",
    dataSort: true,
    formatter: (cell) => (
      <span className="text-sm text-neutral-1000">{cell || "Multiple"}</span>
    ),
  },
  {
    dataField: "total_employees",
    text: "Total Employees",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-semibold text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "active",
    text: "Active",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-green-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "on_leave",
    text: "On Leave",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-yellow-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "terminated",
    text: "Terminated",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-red-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "retired",
    text: "Retired",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium ">{cell || 0}</span>
      </div>
    ),
  },
];

// Diversity Report Columns - Updated for new API structure
export const DiversityColumns = () => [
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => (
      <span className="font-medium text-neutral-1200">{cell || "Unknown"}</span>
    ),
  },
  {
    dataField: "total_employees",
    text: "Total Employees",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-semibold text-plum-900">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "male",
    text: "Male",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-blue-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "female",
    text: "Female",
    dataSort: true,
    formatter: (cell) => (
      <div className="text-center">
        <span className="text-lg font-medium text-pink-600">{cell || 0}</span>
      </div>
    ),
  },
  {
    dataField: "male_percentage",
    text: "Male %",
    dataSort: true,
    formatter: (cell) => (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">{cell}%</span>
        </div>
        <Progress value={cell} className="h-2" />
      </div>
    ),
  },
  {
    dataField: "female_percentage",
    text: "Female %",
    dataSort: true,
    formatter: (cell) => (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">{cell}%</span>
        </div>
        <Progress value={cell} className="h-2" />
      </div>
    ),
  },
  {
    dataField: "nationality_breakdown",
    text: "Top Nationalities",
    dataSort: false,
    formatter: (cell) => (
      <div className="text-xs text-neutral-1000 max-w-xs">
        {cell || "View Details"}
      </div>
    ),
  },
];
