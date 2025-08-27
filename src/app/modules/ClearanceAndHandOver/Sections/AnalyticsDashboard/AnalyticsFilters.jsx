// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsFilters.jsx

import React from "react";
import { FilterInput } from "components/FormControl";

const AnalyticsFilters = ({
  filterData,
  onFilterChange,
  departmentOptions = [],
  clearanceTypeOptions = [],
  onClearFilters,
}) => {
  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROCESS", label: "In Process" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const overdueOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // SLA status filter options
  const slaStatusOptions = [
    { value: "WITHIN_SLA", label: "Within SLA" },
    { value: "AT_RISK", label: "At Risk" },
    { value: "BREACHED", label: "Breached" },
    { value: "NO_SLA", label: "No SLA" },
  ];

  const hasActiveFilters = Object.keys(filterData).some(
    (key) =>
      filterData[key] &&
      filterData[key] !== "" &&
      (!Array.isArray(filterData[key]) || filterData[key].length > 0)
  );

  return (
    <FilterInput
      filters={[
        {
          type: "search",
          name: "employee_search",
          placeholder: "Search by employee name",
        },
        {
          type: "select",
          options: departmentOptions,
          name: "department",
          placeholder: "Department",
        },
        {
          type: "select-one",
          option: clearanceTypeOptions,
          name: "clearance_type",
          placeholder: "Clearance Type",
          values: filterData.clearance_type || "",
        },
        {
          type: "select-two",
          option: statusOptions,
          name: "status",
          placeholder: "Status",
          values: filterData.status || "",
        },
        {
          type: "select",
          options: slaStatusOptions,
          name: "sla_status",
          placeholder: "SLA Status",
        },
        {
          type: "select",
          options: overdueOptions,
          name: "is_overdue",
          placeholder: "Overdue",
        },
      ]}
      filterValues={filterData}
      onChange={onFilterChange}
      className="justify-start"
    />
  );
};

export default AnalyticsFilters;
