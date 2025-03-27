import { ResignationStatusOptions } from "data/Data";
import { terminationReasonsOptions } from "data/Data";
import { TerminationStatusOptions } from "data/Data";
import { ResignationReasons } from "data/Data";
import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countriesList,
  UserRoles,
  workplaceTypes,
  GenderOptions,
  BloodGroupOptions,
} from "data/Data";
import { useSelector } from "react-redux";
import moment from "moment";
import { ClaimExpenseTypeOptions } from "data/Data";
import { ReasonForLeaving } from "data/Data";

function getCountryFullName(countryCode) {
  const country = countriesList.find((option) => option.value === countryCode);
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
  const response = workplaceTypes.find(
    (option) => option.value === workPlaceType
  );
  return response ? response.label : workPlaceType;
}
export function getBloodGroup(bloodGroup) {
  const response = BloodGroupOptions.find(
    (option) => option.value === bloodGroup
  );
  return response ? response.label : bloodGroup;
}
export function getGender(gender) {
  const response = GenderOptions.find((option) => option.value === gender);
  return response ? response.label : gender;
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
function DepartmentName({ value, fallBackText = "N/A" }) {
  const departments = useSelector((state) => state.common.departments);
  const department = departments.find(
    (option) => option.value === parseInt(value)
  );
  return department ? department.label : value ?? fallBackText;
}

export function DocCategoryName({ value, fallBackText = "N/A" }) {
  const doc_categories = useSelector((state) => state.doc_category.category);
  const doc_category = doc_categories.find(
    (option) => option.value === parseInt(value)
  );
  return doc_category ? doc_category.label : value ?? fallBackText;
}

export function BranchName({ value, fallBackText = "N/A" }) {
  const branches = useSelector((state) => state.common.branches);
  const branch = branches.find((option) => option.value === parseInt(value));
  return branch ? branch.label : value ?? fallBackText;
}
function ProjectName({ value }) {
  const projects = useSelector((state) => state.common.projects);
  const project = projects.find((option) => option.value === parseInt(value));
  return project ? project.label : "N/A";
}
function DesignationName({ value }) {
  const designations = useSelector((state) => state.common.designations);
  const designation = designations.find(
    (option) => option.value === parseInt(value)
  );
  return designation ? designation.label : "N/A";
}

function EmployeeName({ value, length }) {
  const employees = useSelector((state) => state.emp.employees);
  const employee = employees.find((option) => option.value === parseInt(value));
  const employeeName = employee ? employee.name : "N/A";
  const displayedName = length ? employeeName.slice(0, length) : employeeName;

  return <>{displayedName}</>;
}

export function EmployeeNameList(employeeIdList) {
  const employees = useSelector((state) => state.emp.employees);
  const employeesNameList = employees
    .filter((employee) => employeeIdList.includes(employee.value))
    .map((employee) => employee.name);

  return employeesNameList;
}

function GetUser(id) {
  const employees = useSelector((state) => state.emp.employees_detail);
  const employee = employees.find((option) => option.value === parseInt(id));
  return employee ?? null;
}
function EmployeeProfilePicture(id) {
  const employees = useSelector((state) => state.emp.employees_detail);
  const employee = employees.find((option) => option.value === parseInt(id));
  if (employee) {
    const employeeProfilePicture = employee.profile_picture ?? null;
    return {
      profile_picture: employeeProfilePicture,
      name: `${employee?.first_name} ${employee?.last_name}`,
    };
  } else {
    return {
      profile_picture: null,
      name: `N/A`,
    };
  }
}

function EmployeeID({ value }) {
  // Ensure value is a string and validate its format
  const employee =
    value && typeof value === "string" && value.startsWith("TBX-")
      ? value
      : `TBX-${String(value || "").padStart(4, "0")}`;

  return employee;
}
export function FormatID({ value, prefix }) {
  // Generate a formatted ID for various entities (e.g., project, task, employee, job applicant, etc.)
  const formattedID = `${prefix}${String(value || "").padStart(6, "0")}`; // Ensure numeric values are zero-padded with prefix
  return formattedID;
}

function getEmployeeid(value) {
  const employee = value ? `${value.toString().padStart(4, "0")}` : "N/A";
  return employee;
}

function ManagerName({ value, fallBackText = "N/A" }) {
  const managers = useSelector((state) => state.emp.reportingManagers);
  const manager = managers.find((option) => option.value === parseInt(value));
  return <>{manager ? manager.label : fallBackText}</>;
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
function TerminationReason(value) {
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

export function getLabelByValue(value, options) {
  const selectedOption = options.find((option) => option.value === value);
  return selectedOption ? selectedOption.label : "N/A";
}

function getManagerName(value, managers) {
  const manager = managers.find((option) => option.value === value);
  return manager ? manager.label : "N/A";
}

function getOrganizationCountryFullName(countryCode, countryOptions) {
  const country = countryOptions.find((option) => option.value === countryCode);
  return country ? country.label : countryCode;
}

const getStatusLabel = (statusValue, TaskStatus) => {
  return (
    TaskStatus.find((status) => status.value === statusValue)?.label ||
    statusValue
  );
};

function getDesignationName(value, designations) {
  const designation = designations.find(
    (option) => option.value === parseInt(value)
  );

  console.log("designation", designation);
  return designation ? designation.label : "N/A";
}

export {
  getStatusLabel,
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
  GetUser,
  UserRole,
  ProjectName,
  TerminationStatus,
  EmployeeProfilePicture,
  ResignationStatus,
  TerminationReason,
  getExperience,
  getExpenseType,
  getDepartmentName,
  getManagerName,
  getOrganizationCountryFullName,
  getDesignationName,
};
