import { ResignationStatusOptions } from "data/Data";
import { terminationReasonsOptions } from "data/Data";
import { TerminationStatusOptions } from "data/Data";
import { ResignationReasons } from "data/Data";
import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countryOptions,
  UserRoles,
  workplaceTypes
} from "data/Data";
import { useSelector } from "react-redux";
import moment from "moment";
import { ClaimExpenseTypeOptions } from "data/Data";
import { ReasonForLeaving } from "data/Data";

function getCountryFullName(countryCode) {
  const country = countryOptions.find((option) => option.value === countryCode);
  return country ? country.label : countryCode;
}

function getEmployeeType(employeeType) {
  const response = employeeTypeOptions.find(
    (option) => option.value === employeeType
  );
  return response ? response.label : employeeType;
}
function UserRole({ value }) {
  const response = UserRoles.find((option) => option.value === parseInt(value));
  return response ? response.label : "";
}
function getWorkType(workType) {
  const response = workTypeOptions.find((option) => option.value === workType);
  return response ? response.label : workType;
}
function getWorkPlaceType(workPlaceType) {
  const response = workplaceTypes.find((option) => option.value === workPlaceType);
  return response ? response.label : workPlaceType;
}
function getJobType(jobType, includeAllOption = false) {
  const response = jobTypeOptions.find((option) => option.value === jobType);
  return response ? response.label : jobType;
}
function getWorkLocation(workLocation) {
  const response = locationTypeOptions.find(
    (option) => option.value === workLocation
  );
  return response ? response.label : "";
}

function TerminationStatus(status) {
  const response = TerminationStatusOptions.find(
    (option) => option.value === status
  );
  return response ? response.label : status ?? "N/A";
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
  const employeeName = employee ? employee.name : "N/A";
  const displayedName = length ? employeeName.slice(0, length) : employeeName;

  return <>{displayedName}</>;
}

function EmployeeID({ value }) {
  // Ensure value is a string and validate its format
  const employee =
    value && typeof value === "string" && value.startsWith("TBX-")
      ? value
      : `TBX-${String(value || "").padStart(4, "0")}`;

  return <>{employee}</>;
}

function getEmployeeid(value) {
  const employee = value ? `${value.toString().padStart(4, "0")}` : "N/A";
  return employee;
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
  const response = ReasonForLeaving.find((option) => option.value === value);
  return response ? response.label : "N/A";
}
function TerminationReason( value ) {
  const reason = terminationReasonsOptions.find(
    (option) => option.value === value
  );
  console.log(value, reason, terminationReasonsOptions);
  return reason ? reason.label : "Unknown Reason";
}

function getExperience(joiningDate) {
  let startDate;

  // Try parsing the date using both formats
  if (moment(joiningDate, "MM-DD-YYYY", true).isValid()) {
    startDate = moment(joiningDate, "MM-DD-YYYY");
  } else if (moment(joiningDate, "YYYY-MM-DD", true).isValid()) {
    startDate = moment(joiningDate, "YYYY-MM-DD");
  } else {
    return "Invalid joining date format.";
  }

  const endDate = moment(); // Current date

  // Check if the joining date is in the future
  if (startDate.isAfter(endDate)) {
    return "Joining date is in the future.";
  }

  const duration = moment.duration(endDate.diff(startDate));

  const years = Math.floor(duration.asYears());
  const months = Math.floor(duration.asMonths()) % 12;
  console.log(`returning ${years} years, ${months} months`);
  return `${years} years, ${months} months`;
}
function getExpenseType(value) {
  const response = ClaimExpenseTypeOptions.find(
    (option) => option.value === value
  );
  return response ? response.label : "N/A";
}

function getDepartmentName(value, departments) {
  const department = departments.find((option) => option.value === value);
  return department ? department.label : "N/A";
}

function getDesignationName(value, designations) {
  const designation = designations.find((option) => option.value === value);
  return designation ? designation.label : "N/A";
}

function getManagerName(value, managers) {
  const manager = managers.find((option) => option.value === value);
  return manager ? manager.label : "N/A";
}

function getOrganizationCountryFullName(countryCode, countryOptions) {
  const country = countryOptions.find((option) => option.value === countryCode);
  return country ? country.label : countryCode;
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
  getWorkPlaceType,
  ManagerName,
  EmployeeName,
  EmployeeID,
  getEmployeeid,
  UserRole,
  ProjectName,
  TerminationStatus,
  ResignationStatus,
  TerminationReason,
  getExperience,
  getExpenseType,
  getDepartmentName,
  getDesignationName,
  getManagerName,
  getOrganizationCountryFullName,
};
