// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsFilters.jsx

import React from "react";
import { FilterInput } from "components/FormControl";
import { Card, CardContent } from "components/ui/card";

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

  const riskLevelOptions = [
    { value: "HIGH", label: "High Risk" },
    { value: "MEDIUM", label: "Medium Risk" },
    { value: "LOW", label: "Low Risk" },
  ];

  const overdueOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
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
          type: "select-one", // Using select-one instead of select-multi
          option: clearanceTypeOptions, // Note: it's 'option' not 'options'
          name: "clearance_type",
          placeholder: "Clearance Type",
          values: filterData.clearance_type || "",
        },
        {
          type: "select-two", // Using select-two instead of select-multi
          option: statusOptions,
          name: "status",
          placeholder: "Status",
          values: filterData.status || "",
        },
        {
          type: "select-three", // Using select-three instead of select-multi
          option: riskLevelOptions,
          name: "risk_level",
          placeholder: "Risk Level",
          values: filterData.risk_level || "",
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
