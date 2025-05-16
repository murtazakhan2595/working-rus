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
import { getRoleAssignmentHistoryLogsList } from "app/hooks/rolesPermisions";
import { RoleAssignmentHistoryLogsColumn } from "app/modules/RoleAndPermissions/Sections";
import { useNavigate } from "react-router-dom";

const RoleAssignmentHistoryLogs = () => {
  const [roles, setRoles] = useState({ results: [], count: 0 });
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

      const response = await getRoleAssignmentHistoryLogsList({
        filterData,
        options,
        ordering,
      });

      if (isMounted) {
        setRoles(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
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
      <CardTitle className="text-primary pt-6">Role List</CardTitle>
      <CardDescription className="text-neutral-1100">
        Here you can manage roles and their permissions. Add, edit, or delete
        roles as needed.
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search Role Name",
            name: "name",
          },
        ]}
        className="justify-end"
        onChange={handleFilterChange}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={RoleAssignmentHistoryLogsColumn}
          data={roles?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={roles?.count || 0}
          pagination={true}
          className="roles-table"
        />
      )}
    </div>
  );
};

export default RoleAssignmentHistoryLogs;
