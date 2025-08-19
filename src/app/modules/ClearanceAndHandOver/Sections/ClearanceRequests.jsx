import { TableCustom } from "components";
import { PageLoader } from "components";
import { ClearanceColumns } from "./ClearanceColumns";
import { FilterInput } from "components/FormControl";
import { useState } from "react";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";

// Dummy data for clearance requests
const dummyClearanceData = {
  results: [
    {
      id: 1,
      employee_name: "John Doe",
      employee_id: "EMP001",
      department: "IT Department",
      designation: "Software Engineer",
      clearance_type: "Leave",
      clearance_start_date: "2024-08-20",
      status: "Pending",
    },
    {
      id: 2,
      employee_name: "Jane Smith",
      employee_id: "EMP002",
      department: "HR Department",
      designation: "HR Specialist",
      clearance_type: "Internal Transfer",
      clearance_start_date: "2024-08-18",
      status: "In Process",
    },
    {
      id: 3,
      employee_name: "Mike Johnson",
      employee_id: "EMP003",
      department: "Finance Department",
      designation: "Financial Analyst",
      clearance_type: "External Transfer",
      clearance_start_date: "2024-08-15",
      status: "Completed",
    },
    {
      id: 4,
      employee_name: "Sarah Wilson",
      employee_id: "EMP004",
      department: "Marketing Department",
      designation: "Marketing Manager",
      clearance_type: "Job Rotation",
      clearance_start_date: "2024-08-22",
      status: "Pending",
    },
    {
      id: 5,
      employee_name: "David Brown",
      employee_id: "EMP005",
      department: "Operations Department",
      designation: "Operations Lead",
      clearance_type: "Resignation",
      clearance_start_date: "2024-08-16",
      status: "Rejected",
    },
    {
      id: 6,
      employee_name: "Emily Davis",
      employee_id: "EMP006",
      department: "IT Department",
      designation: "Senior Developer",
      clearance_type: "Special Leave",
      clearance_start_date: "2024-08-19",
      status: "In Process",
    },
    {
      id: 7,
      employee_name: "Alex Turner",
      employee_id: "EMP007",
      department: "Legal Department",
      designation: "Legal Advisor",
      clearance_type: "Termination",
      clearance_start_date: "2024-08-14",
      status: "Completed",
    },
  ],
  count: 7,
};

// Dummy department options
const departmentOptions = [
  { value: "IT Department", label: "IT Department" },
  { value: "HR Department", label: "HR Department" },
  { value: "Finance Department", label: "Finance Department" },
  { value: "Marketing Department", label: "Marketing Department" },
  { value: "Operations Department", label: "Operations Department" },
  { value: "Legal Department", label: "Legal Department" },
];

// Clearance status options
const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Process", label: "In Process" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
];

// Clearance type options
const clearanceTypeOptions = [
  { value: "Leave", label: "Leave" },
  { value: "Job Rotation", label: "Job Rotation" },
  { value: "Internal Transfer", label: "Internal Transfer" },
  { value: "External Transfer", label: "External Transfer" },
  { value: "Resignation", label: "Resignation" },
  { value: "Termination", label: "Termination" },
  { value: "Special Leave", label: "Special Leave" },
];

export default function ClearanceRequests({
  options,
  onPageChange,
  setOrdering,
  loading,
  data,
  reload,
  onViewChecklist,
  filterData,
  setFilterData,
}) {
  // Use dummy data for now since API is not ready
  const displayData = data || dummyClearanceData;

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
          <CardTitle className="text-primary">Clearance Requests</CardTitle>
          <CardDescription className="text-neutral-1100">
            Manage and track all employee clearance requests including leave,
            transfers, rotations, and other clearance types.
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
              options: statusOptions,
              name: "status",
              placeholder: "Clearance Status",
            },
            {
              type: "select",
              options: clearanceTypeOptions,
              name: "clearance_type",
              placeholder: "Clearance Type",
            },
            {
              type: "date-range",
              name: "clearance_date_range",
              placeholder: "Clearance Start Date",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={ClearanceColumns(reload, displayData?.results || [])}
            data={displayData?.results || []}
            tableOptions={tableOptions}
            dataTotalSize={displayData?.count || 0}
            pagination={true}
          />
        )}
      </CardContent>
    </div>
  );
}
