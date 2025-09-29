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
import { useSelector } from "react-redux";

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
  const Departments = useSelector((state) => state.common.departments);
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
            Clearance Records
          </CardTitle>
          <CardDescription className="text-neutral-1100">
            View historical records of all completed clearance processes. This tab serves as an audit log for compliance and reference.
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
              options: Departments,
              name: "department",
              placeholder: "Department",
            },
            {
              type: "select",
              options: clearanceTypes,
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
