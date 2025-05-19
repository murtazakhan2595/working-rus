import React, { useEffect, useState } from "react";
import { TableCustom, Header } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import PageLoader from "components/PageLoader";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { getEmployeeList } from "app/hooks/general";
import { RoleAssignmentEmployeesLogsColumn } from "app/modules/RoleAndPermissions/Sections";
import { useNavigate } from "react-router-dom";
import RoleAssignmentEmployeeHistoryLogs from "./RoleAssignmentEmployeeHistoryLogs";

const RoleAssignmentHistoryLogs = () => {
  const [Employees, setEmployees] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchData = async (isMounted) => {
    try {
      setLoading(true);
      // Add organizationId to filter if available

      const response = await getEmployeeList({
        filterData,
        options,
        ordering,
      });

      if (isMounted) {
        setEmployees(response);
      }
    } catch (error) {
      console.error("Error fetching Employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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
  return (
    <div className="flex flex-col gap-4">
      <CardTitle className="text-primary pt-6">
        Role Assignment History & Logs
      </CardTitle>
      <CardDescription className="text-neutral-1100">
        {/* Here you can manage Employees and their permissions. Add, edit, or delete
        Employees as needed. */}
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search Employee ID",
            name: "serial_number",
          },
          {
            type: "search",
            placeholder: "Search Employee Name",
            name: "first_name",
          },
        ]}
        className="justify-end"
        onChange={handleFilterChange}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={RoleAssignmentEmployeesLogsColumn}
          data={Employees?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={Employees?.count || 0}
          pagination={true}
          className="Employees-table"
        />
      )}
    </div>
  );
};

export default RoleAssignmentHistoryLogs;
export { RoleAssignmentEmployeeHistoryLogs };
