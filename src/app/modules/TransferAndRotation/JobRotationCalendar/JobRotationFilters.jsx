// src/app/modules/TransferAndRotation/JobRotationCalendar/JobRotationFilters.jsx
import React, { useState, useEffect } from "react";
import { FilterInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";

const JobRotationFilters = ({ onFilterChange, jobRotations }) => {
  const [filterData, setFilterData] = useState({});

  const Departments = useSelector((state) => state.common.departments) || [];
  const Branches = useSelector((state) => state.common.branches) || [];

  // Status options for filtering
  const statusOptions = [
    { label: "Pending Approval", value: "pending" },
    { label: "Scheduled", value: "approved" },
    { label: "Cancelled", value: "rejected" },
  ];

  useEffect(() => {
    onFilterChange(filterData);
  }, [filterData, onFilterChange]);

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const handleResetFilters = () => {
    setFilterData({});
  };

  const getActiveFilterCount = () => {
    return Object.keys(filterData).length;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by Name or ID",
                name: "employee_search",
                values: filterData.employee_search || "",
              },
              {
                type: "select-one",
                option: Departments,
                name: "department",
                placeholder: "Department",
                values: filterData.department || "",
              },
              {
                type: "select-two",
                option: statusOptions,
                name: "status",
                placeholder: "Status",
                values: filterData.status || "",
              },
              {
                type: "select-three",
                option: Branches,
                name: "current_branch",
                placeholder: "Current Branch",
                values: filterData.current_branch || "",
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="shrink-0"
          disabled={getActiveFilterCount() === 0}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default JobRotationFilters;
