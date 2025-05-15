// AssignedRoles.jsx
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
import AssignRoleForm from "./AssignRoleForm";
import { AssignedRolesColumn } from "../Sections";
import SheetComponent from "components/ui/SheetComponent";
import { getEmployeeList } from "app/hooks/attendance";
import { getUserRolePermissionsData } from "app/hooks/rolesPermisions";
import { getRoleList } from "app/hooks/general";

const AssignedRoles = ({
  loading: initialLoading,
  reload: externalReload,
  organizationId,
}) => {
  const [assignedRoles, setAssignedRoles] = useState();
  const [loading, setLoading] = useState(initialLoading || false);
  const [openAssignRoleForm, setOpenAssignRoleForm] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [reloadCounter, setReloadCounter] = useState(0);
  const [roles, setRoles] = useState([]);
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
      const response = await getEmployeeList({options: options, filterData: filterData, })
      if (isMounted) {
        setAssignedRoles(response);
      }      
    } catch (error) {
      console.error("Error fetching assigned roles:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRoles = async (isMounted) => {
    try {
      const response = await getRoleList();

      console.log("rolesssssssssssssssss ", response);
      if (isMounted && response) {
        setRoles(response.results || []);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    fetchRoles(isMounted);
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
              setOpenAssignRoleForm(true);
            }}
          >
            Assign Roles
          </Button>
        }
      />
      <div className="flex flex-col gap-4">
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID and Name",
              name: "emp_search",
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
              <CardTitle className="text-primary">Assigned Roles</CardTitle>
              <CardDescription className="text-neutral-1100">
                Here you can view and manage role assignments for employees.
                Assign, edit, or remove roles as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={AssignedRolesColumn(forceReload, roles)}
                data={assignedRoles?.results?.employees || []}
                tableOptions={tableOptions}
                dataTotalSize={assignedRoles?.count || 0}
                pagination={true}
                className="assigned-roles-table"
              />
            </CardContent>
          </Card>
        )}
      </div>
      {openAssignRoleForm && (
        <SheetComponent
          triggerText={null}
          title="Assign Roles to Employee"
          description={null}
          footer={null}
          isOpen={openAssignRoleForm}
          setIsOpen={setOpenAssignRoleForm}
          width="568px"
        >
          <AssignRoleForm
            isOpen={openAssignRoleForm}
            setIsOpen={setOpenAssignRoleForm}
            reload={fetchData}
          />
        </SheetComponent>
      )}
    </div>
  );
};

export default AssignedRoles;
