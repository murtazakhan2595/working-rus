import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countryOptions,
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

function EmployeeName({ value }) {
  const employees = useSelector((state) => state.emp.employees);
  const employee = employees.find(
    (option) => option.value === parseInt(value)
  );
  return <>{employee ? employee.label : "N/A"}</>;
}


function ManagerName({ value }) {
  const managers = useSelector((state) => state.common.reportingManagers);
  const manager = managers.find(
    (option) => option.value === parseInt(value)
  );
  return <>{manager ? manager.label : "N/A"}</>;
}

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
  EmployeeName,
};
