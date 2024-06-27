import { getDepartmentList } from "../utils/";
import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countryOptions,
} from "data/Data";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";

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
const getLeaveType = async (leaveType, LeaveTypes) => {
  // const LeaveTypes = await getLeaveTypes();
  const response = LeaveTypes.find((option) => option.value === leaveType);
  return response ? response.label : "";
};
// Function to get department name from department value
const getDepartmentName = async (departmentValue) => {
  console.log("I am department value", departmentValue);
  const departmentList = await getDepartmentList();
  const department = departmentList?.find(
    (option) => option.value === departmentValue
  );
  console.log("I am departments", departmentList);
  return department ? department.label : null;
};
function LeaveType(value) {
  const LeaveTypes = useSelector((state) => state.common.leaveTypes);
  const response = LeaveTypes.find((option) => option.value === value);
  return <>{response ? response.label : "N/A"}</>;
}
// Function to get department name from department value
function DepartmentName(value) {
  const departments = useSelector((state) => state.common.departments);
  const department = departments.find(
    (option) => option.value === parseInt(value)
  );
  return <>{department ? department.label : "N/A"}</>;
}


export {
  getCountryFullName,
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
  DepartmentName,
  LeaveType,
};
