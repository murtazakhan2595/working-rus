import React, { useState, useEffect } from "react";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import { useSelector } from "react-redux";

const ShiftCalendarFilters = ({
  onFilterChange,
  showShiftStatus = true,
  searchPlaceholder = "Search by ID and Name",
}) => {
  const [filterData, setFilterData] = useState({});
  const Departments = useSelector((state) => state.common.departments);

  // Filter options for shift assignment status
  const shiftStatusOptions = [
    { value: "", label: "All" },
    { value: "assigned", label: "Assigned" },
    { value: "not_assigned", label: "Not Assigned" },
  ];

  // Unified filter change handler
  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  // Pass filter data up to parent component
  useEffect(() => {
    onFilterChange(filterData);
  }, [filterData, onFilterChange]);

  // Reset internal state when filters are cleared externally
  useEffect(() => {
    if (Object.keys(filterData).length === 0) {
      // No need to reset individual states, just rely on filterData
    }
  }, [filterData]);

  return (
    <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row gap-2 mb-4">
      {showShiftStatus ? (
        <div className="flex">
          <SelectInputComponent
            name="shift_status"
            value={filterData.shift_status || ""}
            placeholder="Shift Status"
            options={shiftStatusOptions}
            onChange={(name, value) => handleFilterChange("shift_status", value)}
            classes="flex-row"
          />
        </div>
      ) : (
        <div></div>
      )}
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: searchPlaceholder,
            name: "emp_search",
            values: filterData.emp_search || "",
          },
          {
            type: "select",
            options: Departments,
            name: "department_name",
            placeholder: "Department",
            values: filterData.department_name || "",
          },
        ]}
        onChange={handleFilterChange}
      />
    </div>
  );
};

export default ShiftCalendarFilters;
