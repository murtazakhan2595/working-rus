import {
  workTypeOptions,
  employeeTypeOptions,
  jobTypeOptions,
  locationTypeOptions,
  countryOptions,
} from "data/Data";

function getCountryFullName(countryCode) {
  const country = countryOptions.find((option) => option.value === countryCode);
  return country ? country.label : null;
}
function getEmployeeType(employeeType) {
  const response = employeeTypeOptions.find((option) => option.value === employeeType);
  return response ? response.label : '';
}
function getWorkType(workType) {
  const response = workTypeOptions.find((option) => option.value === workType);
  return response ? response.label : '';
}
function getJobType(jobType) {
  const response = jobTypeOptions.find((option) => option.value === jobType);
  return response ? response.label : '';
}
function getWorkLocation(workLocation) {
  const response = locationTypeOptions.find((option) => option.value === workLocation);
  return response ? response.label : '';
}
function getFilterList(userRole) {
  // if(userRole === 1)
  const filterList = { status_hr: "" };
  return filterList;
}

export { getCountryFullName, getEmployeeType, getWorkType, getJobType, getWorkLocation };
