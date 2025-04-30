import { ResignationStatusOptions } from "data/Data";
import { terminationReasonsOptions } from "data/Data";
import { TerminationStatusOptions } from "data/Data";
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
import { ReasonForLeaving, SalaryTypeOptions } from "data/Data";

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
function DepartmentName({ value, fallBackText = "N/A" }) {
  const departments = useSelector((state) => state.common.departments);
  
  // If value is falsy, return fallback
  if (!value) return fallBackText;
  
  // Handle case where value is already a string (like "CEO")
  if (typeof value === 'string' && isNaN(parseInt(value))) {
    return value;
  }
  
  // Try to find department by ID
  const parsedValue = parseInt(value);
  const department = departments.find(
    (option) => option.value === parsedValue
  );
  
  console.log(`DepartmentName: value=${value}, parsed=${parsedValue}, found=${department?.label || 'not found'}`);
  
  // Return department label if found, otherwise original value or fallback
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

export function SalaryType({ value, fallBackText = "N/A" }) {
  const SalaryTypeList = SalaryTypeOptions;
  const salaryType = SalaryTypeList.find((option) => option.value === value);
  return salaryType ? salaryType.label : value ?? fallBackText;
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
export function RenderNameList({
  value,
  fallBackText = "N/A",
  NameVariant,
  seperator = ",",
  className,
}) {
  if (!value || value.length === 0) {
    return fallBackText;
  }

  return (
    <>
      {value.map((dept, index) => (
        <div key={index} className={className}>
          <NameVariant value={dept} fallBackText="All" />
          {seperator}
        </div>
      ))}
    </>
  );
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
function TerminationReason({ value, fallBackText = "Unknown Reason" }) {
  const Reasons = useSelector((state) => state.exit_emp.TerminationReasons);
  const Reason = Reasons.find((option) => option.value === parseInt(value));
  return <>{Reason ? Reason.label : fallBackText ?? value}</>;
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
  return `${years} years, ${months} months`;
}
function getExpenseType(value, expenseTypeOptions) {
  const response = expenseTypeOptions?.find((option) => option.value === value);
  return response ? response.label : "N/A";
}

function getDepartmentName(value, departments, fallBackText) {
  const department = departments.find((option) => option.value === value);
  return department ? department.label : fallBackText ?? "N/A";
}

export function getLabelByValue(value, options = [], fallBackText = "N/A") {
  if (Array.isArray(value)) {
    const labels = value
      .map((val) => {
        const option = options.find((option) => option.value === parseInt(val));
        return option ? option.label : null;
      })
      .filter(Boolean);

    return labels.length ? labels.join(", ") : fallBackText;
  }

  const selectedOption = options.find(
    (option) => option.value === parseInt(value)
  );
  return selectedOption ? selectedOption.label : fallBackText;
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
