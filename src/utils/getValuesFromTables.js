import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countryOptions,
  UserRoles,
} from "data/Data";
import { useSelector } from "react-redux";

function getCountryFullName(countryCode) {
  const country = countryOptions.find((option) => option.value === countryCode);
  return country ? country.label : null;
}

function getEmployeeType(employeeType) {
  const response = employeeTypeOptions.find(
    (option) => option.value === employeeType
  );
  return response ? response.label : "";
}
function UserRole({ value }) {
  const response = UserRoles.find((option) => option.value === parseInt(value));
  return response ? response.label : "";
}
function getWorkType(workType) {
  const response = workTypeOptions.find((option) => option.value === workType);
  return response ? response.label : "";
}
function getJobType(jobType) {
  const response = jobTypeOptions.find((option) => option.value === jobType);
  return response ? response.label : "";
}
function getWorkLocation(workLocation) {
  const response = locationTypeOptions.find(
    (option) => option.value === workLocation
  );
  return response ? response.label : "";
}
function LeaveType({ value }) {
  const LeaveTypes = useSelector((state) => state.common.leaveTypes);
  const response = LeaveTypes.find(
    (option) => option.value === parseInt(value)
  );
  return <>{response ? response.label : "N/A"}</>;
}
function TerminationStatus(status) {
  const response = TerminationStatusOptions.find(
    (option) => option.value === status
  );
  return response ? response.label : status ?? "N/A";
}
function LeaveTypeOfEmployee({ value, list }) {
  const response = list.find((option) => option.value === parseInt(value));
  return <>{response ? response.label : "N/A"}</>;
}
// Function to get department name from department value
function DepartmentName({ value }) {
  const departments = useSelector((state) => state.common.departments);
  const department = departments.find(
    (option) => option.value === parseInt(value)
  );
  return <>{department ? department.label : value ?? "N/A"}</>;
}
function ProjectName({ value }) {
  const projects = useSelector((state) => state.common.projects);
  const project = projects.find((option) => option.value === parseInt(value));
  return <>{project ? project.label : "N/A"}</>;
}
function DesignationName({ value }) {
  const designations = useSelector((state) => state.common.designations);
  const designation = designations.find(
    (option) => option.value === parseInt(value)
  );
  return <>{designation ? designation.label : "N/A"}</>;
}

function EmployeeName({ value, length }) {
  const employees = useSelector((state) => state.emp.employees);
  const employee = employees.find((option) => option.value === parseInt(value));
  const employeeName = employee ? employee.name?.toUpperCase() : "N/A";
  const displayedName = length ? employeeName.slice(0, length) : employeeName;

  return <>{displayedName}</>;
}

function EmployeeID({ value }) {
  const employee = value ? `TXB-${value.toString().padStart(4, "0")}` : "N/A";
  return <>{employee}</>;
}

function ManagerName({ value }) {
  const managers = useSelector((state) => state.emp.reportingManagers);
  const manager = managers.find((option) => option.value === parseInt(value));
  return <>{manager ? manager.label : "N/A"}</>;
}
function ResignationStatus(status) {
  const response = ResignationStatusOptions.find(
    (option) => option.value === status
  );
  return response ? response.label : "N/A";
}
function ResignationReason(value) {
  const response = ResignationReasons.find((option) => option.value === value);
  return response ? response.label : "N/A";
}
function TerminationReason({ value }) {
  const reason = terminationReasonsOptions.find(
    (option) => option.value === value
  );
  console.log(value, reason, terminationReasonsOptions);
  return reason ? reason.label : "Unknown Reason";
}

export {
  getCountryFullName,
  ResignationReason,
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
  DepartmentName,
  DesignationName,
  ManagerName,
  LeaveType,
  LeaveTypeOfEmployee,
  EmployeeName,
  EmployeeID,
  UserRole,
  ProjectName,
  TerminationStatus,
  ResignationStatus,
  TerminationReason,
};
