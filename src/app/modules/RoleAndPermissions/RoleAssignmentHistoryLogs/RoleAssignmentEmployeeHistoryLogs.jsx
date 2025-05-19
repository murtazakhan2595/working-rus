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
import { useNavigate, useLocation } from "react-router-dom";
import { EmployeeDetailUI } from "components"; 

const RoleAssignmentEmployeeHistoryLogs = () => {
  const location = useLocation();
  const { GOTO_URLS, employee_id } = location.state || {};
  const [roles, setRoles] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({ employee: employee_id });
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
    <>
      <Header
        showBackButton={true}
        navigationLink={GOTO_URLS || "/office-settings/role-permission/"}
      />
      <Card className='mb-5'>
        <CardTitle className="text-primary px-6 pt-6">
          Employee Details
        </CardTitle>
        <CardDescription className="text-neutral-1100 px-6 pb-6">
          Here is the employee informations
        </CardDescription>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <EmployeeDetailUI
              id={employee_id}
              ViewVariant="vertical"
              InformationKeys={[
                "id",
                "name",
                "department",
                "position",
                "branch",
              ]}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardTitle className="text-primary pt-6 px-6">History & Logs</CardTitle>
        <CardDescription className="text-neutral-1100 px-6 pb-6">
          Here is role assignment history logs of employee.
        </CardDescription>
        <CardContent>
          <div className="flex flex-col gap-4">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search Role Name",
                  name: "role",
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
        </CardContent>
      </Card>
    </>
  );
};

export default RoleAssignmentEmployeeHistoryLogs;
