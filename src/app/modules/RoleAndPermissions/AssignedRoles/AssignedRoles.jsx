// AssignedRoles.jsx
import React, { useEffect, useState } from "react";
import { TableCustom } from "components";
import PageLoader from "components/PageLoader";
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
import { getEmployeeCustomList } from "app/hooks/general";
import { useSelector } from "react-redux";

const AssignedRoles = ({ setOpenAssignRoleForm, openAssignRoleForm }) => {
  const [assignedRoles, setAssignedRoles] = useState();
  const [loading, setLoading] = useState(false);

  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const Departments = useSelector((state) => state.common.departments);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const onSortChange = (sortName) => {
    setOrdering(sortName);
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: onSortChange,
  };

  const fetchData = async (isMounted) => {
    try {
      setLoading(true);
      const response = await getEmployeeCustomList({
        options,
        filterData: {
          ...filterData,
          employee_status: "Active,Probation,Notice Period",
        },
        ordering,
      });
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

      if (isMounted && response) {
        setRoles(response.results || []);
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
    fetchRoles(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if(filterName === "user_role") setSelectedRole(filterValue);
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
      <CardTitle className="text-primary pt-6">Assigned Roles</CardTitle>
      <CardDescription className="text-neutral-1100">
        Here you can view and manage role assignments for employees. Assign,
        edit, or remove roles as needed.
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search by ID and Name",
            name: "emp_search",
          },
          {
            type: "select-one",
            option: roles.map((role) => ({
              label: role.name,
              value: role.id,
            })),
            name: "user_role",
            placeholder: "Assigned Role",
            values: selectedRole,
          },
          {
            type: "select-two",
            option: Departments,
            name: "department_name",
            placeholder: "Department",
            values: selectedDepartment,
          },
        ]}
        className="justify-end"
        onChange={handleFilterChange}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={AssignedRolesColumn(fetchData, roles)}
          data={assignedRoles?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={assignedRoles?.count || 0}
          pagination={true}
          className="assigned-roles-table"
        />
      )}

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
