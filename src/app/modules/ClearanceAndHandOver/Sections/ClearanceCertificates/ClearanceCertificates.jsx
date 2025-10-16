import { TableCustom } from "components";
import { PageLoader } from "components";
import { ClearanceCertificatesColumns } from "./ClearanceCertificatesColumns";
import { FilterInput } from "components/FormControl";
import { useState } from "react";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { useSelector } from "react-redux";

export default function ClearanceCertificates({
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

  const certificateStatusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "GENERATED", label: "Generated" },
    { value: "SENT", label: "Sent" },
    { value: "ONHOLD", label: "On Hold" },
  ];

  const sentToEmployeeOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  return (
    <div className="flex flex-col">
      <CardHeader className="flex flex-row flex-wrap justify-between gap-2 items-center">
        <div>
          <CardTitle className="text-primary">Clearance Certificates</CardTitle>
          <CardDescription className="text-neutral-1100">
            Manage and track all generated clearance certificates. View, edit,
            resend, and download certificates with complete audit trail
            functionality.
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
              options: certificateStatusOptions,
              name: "status",
              placeholder: "Certificate Status",
            },
            {
              type: "select",
              options: clearanceTypes,
              name: "clearance_type",
              placeholder: "Clearance Type",
            },
            {
              type: "select",
              options: sentToEmployeeOptions,
              name: "sent_to_employee",
              placeholder: "Sent to Employee",
            },
            {
              type: "date-range",
              name: "generated_date_range",
              placeholder: "Certificate Generated Date",
            },
            {
              type: "date-range",
              name: "last_working_day_range",
              placeholder: "Last Working Day",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={ClearanceCertificatesColumns(
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
