import { TableCustom } from "components";
import { PageLoader } from "components";
import { ClearanceRecordsColumns } from "./ClearanceRecordsColumns";
import { FilterInput } from "components/FormControl";
import { useState } from "react";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";

// Department options - you may want to fetch this from your common state or API
const departmentOptions = [
  { value: "IT Department", label: "IT Department" },
  { value: "HR Department", label: "HR Department" },
  { value: "Finance Department", label: "Finance Department" },
  { value: "Marketing Department", label: "Marketing Department" },
  { value: "Operations Department", label: "Operations Department" },
  { value: "Legal Department", label: "Legal Department" },
];

// Clearance type options based on API schema
const clearanceTypeOptions = [
  { value: "1", label: "Leave" },
  { value: "2", label: "Job Rotation" },
  { value: "3", label: "Internal Transfer" },
  { value: "4", label: "External Transfer" },
  { value: "5", label: "Resignation" },
  { value: "6", label: "Termination" },
  { value: "7", label: "Special Leave" },
];

export default function ClearanceRecords({
  options,
  onPageChange,
  setOrdering,
  loading,
  data,
  reload,
  filterData,
  setFilterData,
  clearanceTypes,
}) {

  console.log(
    "datadatadatadatadatadatadatadatadatadatadatadatadatadatadata",
    data
  );
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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

  return (
    <div className="flex flex-col">
      <CardHeader className="flex flex-row flex-wrap justify-between gap-2 items-center">
        <div>
          <CardTitle className="text-primary">
            Clearance & Handover Records
          </CardTitle>
          <CardDescription className="text-neutral-1100">
            View historical records of all completed clearance and handover
            processes. This tab serves as an audit log for compliance and
            reference.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={[
            {
              type: "search",
              name: "search",
              placeholder: "Search by employee name or ID",
            },
            {
              type: "select-multi",
              options: departmentOptions,
              name: "department",
              placeholder: "Department",
            },
            {
              type: "select",
              options: clearanceTypeOptions,
              name: "clearance_type",
              placeholder: "Clearance Type",
            },
            {
              type: "date-range",
              name: "start_date_range",
              placeholder: "Clearance Start Date",
            },
            {
              type: "date-range",
              name: "completion_date_range",
              placeholder: "Completion Date",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={ClearanceRecordsColumns(
              reload,
              data?.results || [],
              clearanceTypes
            )}
            data={data?.results || []}
            tableOptions={tableOptions}
            dataTotalSize={data?.count || 0}
            pagination={true}
          />
        )}
      </CardContent>
    </div>
  );
}
