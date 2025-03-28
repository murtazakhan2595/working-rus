import React, { useState, useEffect } from "react";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import { useSelector } from "react-redux";

const ShiftCalendarFilters = ({ onFilterChange, teamMembers }) => {
  const [filterData, setFilterData] = useState({});
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [shiftStatus, setShiftStatus] = useState("");
  const Departments = useSelector((state) => state.common.departments);

  // Filter options for shift assignment status
  const shiftStatusOptions = [
    { value: "", label: "All" },
    { value: "assigned", label: "Assigned" },
    { value: "not_assigned", label: "Not Assigned" },
  ];

  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if (filterName === "shift_status") setShiftStatus(filterValue);

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

  return (
    <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row gap-2 mb-4">
      <div className="flex">
        <SelectInputComponent
          name="shift_status"
          value={shiftStatus}
          placeholder="Shift Status"
          options={shiftStatusOptions}
          onChange={(name, value) => handleFilterChange("shift_status", value)}
          classes="flex-row"
        />
      </div>
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search by ID and Name",
            name: "id_and_first_name",
          },
          {
            type: "select-one",
            option: Departments,
            name: "department_name",
            placeholder: "Department",
            values: selectedDepartment,
          },
        ]}
        onChange={handleFilterChange}
      />
    </div>
  );
};

export default ShiftCalendarFilters;
