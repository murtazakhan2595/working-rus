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
// import RoleAction from "./RoleAction";
import { AddUpdateUserRoleForm } from "app/modules/RoleAndPermissions/UserRole";
import { getUserRoleList } from "app/hooks/rolesPermisions";
import { UserRoleColumn } from "app/modules/RoleAndPermissions/Sections";
import { useNavigate } from "react-router-dom";

const UserRoles = ({
  loading: initialLoading,
  reload: externalReload,
  organizationId,
}) => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(initialLoading || false);
  const [OpenUserRoleForm, setOpenUserRoleForm] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [reloadCounter, setReloadCounter] = useState(0);

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
      const filterPayload = {
        ...filterData,
        ...(organizationId ? { organization: organizationId } : {}),
      };

      const response = await getUserRoleList({
        filterData: filterPayload,
        options: options,
        ordering: ordering,
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
  }, [
    filterData,
    ordering,
    options,
    externalReload,
    reloadCounter,
    organizationId,
  ]);

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

  // Function to force a table reload
  const forceReload = () => {
    setReloadCounter((prev) => prev + 1);
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate("/office-settings/role-managment/user-role/add");
            }}
          >
            Add New User Role
          </Button>
        }
      />
      <div className="flex flex-col gap-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Role List</CardTitle>
              <CardDescription className="text-neutral-1100">
                Here you can manage roles and their permissions. Add, edit, or
                delete roles as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={UserRoleColumn(forceReload)}
                data={roles?.results || []}
                tableOptions={tableOptions}
                dataTotalSize={roles?.count || 0}
                pagination={true}
                className="roles-table"
              />
            </CardContent>
          </Card>
        )}
      </div>
      {OpenUserRoleForm && (
        <AddUpdateUserRoleForm
          isOpen={OpenUserRoleForm}
          setIsOpen={setOpenUserRoleForm}
          reload={fetchData}
        />
      )}
    </div>
  );
};

export default UserRoles;
