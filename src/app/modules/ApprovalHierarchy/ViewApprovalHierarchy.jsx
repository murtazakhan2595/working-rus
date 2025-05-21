import React, { useEffect, useState } from "react";
import { TableCustom } from "components";
import PageLoader from "components/PageLoader";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { getUserRoleList } from "app/hooks/rolesPermisions";
import { UserRoleColumn } from "app/modules/RoleAndPermissions/Sections";
import { HasAccess } from "utils/PermissionUtils";
import Error from "app/modules/Error";

const ViewApprovalHierarchy = ({
  loading: initialLoading,
  reload: externalReload,
  organizationId,
}) => {
  const isViewUserRolePermitted = HasAccess("VIEW_USER_ROLE");
  const [roles, setRoles] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(initialLoading || false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [reloadCounter, setReloadCounter] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('');

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
    if(filterName==='status')setSelectedStatus(filterValue)
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

  if (!isViewUserRolePermitted) return <Error />;

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
          {
            type: "select-one",
            placeholder: "Status",
            name: "status",
            option: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            values:selectedStatus,
          },
        ]}
        className="justify-end"
        onChange={handleFilterChange}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={UserRoleColumn(forceReload)}
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

export default ViewApprovalHierarchy;
