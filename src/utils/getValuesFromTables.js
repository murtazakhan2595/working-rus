import { getDepartmentList } from "app/hooks/general";
import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countryOptions,
} from "data/Data";
import { useEffect } from "react";

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
function getFilterList(userRole) {
  // if(userRole === 1)
  const filterList = { status_hr: "" };
  return filterList;
}
// Function to fetch department list
const fetchDepartmentList = async () => {
  try {
    const response = await getDepartmentList();
    console.log("dept response", response);
    return response; // Return the fetched department data
  } catch (error) {
    console.error("Error fetching department list:", error);
    return []; // Return an empty array in case of error
  }
};

// Function to get department name from department value
const getDepartmentName = async (departmentValue) => {
  try {
    const departmentList = await fetchDepartmentList();
    const department = departmentList.find(
      (option) => option.value === departmentValue
    );
    return department ? department.label : null;
  } catch (error) {
    console.error("Error getting department name:", error);
    return null; // Return null in case of error
  }
};

export {
  getCountryFullName,
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
  getDepartmentName,
};
