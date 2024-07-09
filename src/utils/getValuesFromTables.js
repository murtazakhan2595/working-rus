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
function UserRole({value}) {
  const response = UserRoles.find(
    (option) => option.value === parseInt(value)
  );
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
  return <>{department ? department.label : "N/A"}</>;
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
  const employee = value ? `TXB-${value.toString().padStart(4, "0")}` : 'N/A';
  return <>{employee}</>;
}

function ManagerName({ value }) {
  const managers = useSelector((state) => state.emp.reportingManagers);
  const manager = managers.find((option) => option.value === parseInt(value));
  return <>{manager ? manager.label : "N/A"}</>;
}


// Utility function to get a random color from a list
const getRandomColor = () => {
  const colors = [
    'bg-pink-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


export {
  getCountryFullName,
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
  getRandomColor
};
