import { TableCustom } from "components";
import { PageLoader } from "components";
import { ClearanceColumns } from "./ClearanceColumns";
import { FilterInput } from "components/FormControl";
import { useEffect, useState } from "react";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { useSelector } from "react-redux";
import { getClearanceTypeList } from "app/hooks/officeSetting";
import { clearanceStatusOptions } from "data/Data";



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
  const Departments = useSelector((state) => state.common.departments);
  const [clearanceTypes, setClearanceTypes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchClearanceTypes = async () => {
      try {
        const response = await getClearanceTypeList();
        if (isMounted && response?.results) {
          setClearanceTypes(response.results);
        }
      } catch (error) {
        console.error("Error fetching clearance types:", error);
      }
    };
    fetchClearanceTypes();
    return () => {
      isMounted = false;
    };
  }, []);
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
              options: Departments,
              name: "department",
              placeholder: "Department",
            },
            {
              type: "select",
              options: clearanceStatusOptions,
              name: "status",
              placeholder: "Clearance Status",
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
              placeholder: "Start Date",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={ClearanceColumns(
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
