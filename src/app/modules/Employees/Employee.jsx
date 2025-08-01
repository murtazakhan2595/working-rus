import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "components/ui/card";
import { EmployeeColumns } from "app/utils/Types/TableColumns";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import { employeeStatus } from "data/Data";
import { getEmployeeCustomList } from "app/hooks/general";
import { getEmployeeStatsData } from "app/hooks/employee";
import { PageLoader, Header, TableCustom } from "components";
import Stats from "components/ui/Stats";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import ImportEmployeesButton from "./Screens/Sections/ImportEmployeesButton"; // Adjust the path as needed
import { GetDispatchStateList, GetEmployeeFilteredList } from "utils/Lists";

export default function EmployeeManagement({ isTeamView = false }) {
  const { id: user_id, } = GetDispatchStateList("user_details", "emp") || {};
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Designations = GetDispatchStateList("designations", "common") || [];
  const UserRoles = GetDispatchStateList("user_roles", "roles_permissions") || [];
  const AddEmployeesPermitted = HasAccess("ADD_EMPLOYEE");
  const isAdminView = HasAccess("VIEW_EMPLOYEES");
  const navigate = useNavigate();
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [StatsData, setStatsData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const [ordering, setOrdering] = useState("-id");

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

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedViewFilterData(() => {
        if (isTeamView) return { reporting_employee: [user_id] };
        else if (isAdminView) return {};
      });
    return () => {
      isMounted = false;
    };
  }, [isTeamView, isAdminView]);

  useEffect(() => {
    const fetchEmployeeStatData = async (isMounted) => {
      try {
        setIsLoading(true);
        const Stats = await getEmployeeStatsData({ filterData: permittedViewFilterData });
        if (Stats && isMounted) {
          setStatsData(Stats || {});
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    if (permittedViewFilterData) fetchEmployeeStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [permittedViewFilterData]);

  const fetchData = useCallback(
    async (isMounted = true) => {
      setIsLoading(true);
      try {
        const data = await getEmployeeCustomList({
          options,
          filterData: { ...filterData, ...permittedViewFilterData },
          ordering,
        });

        if (isMounted) {
          const fallback = { results: [], count: 0 };
          setEmployeeData(data || fallback);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    },
    [options, filterData, ordering] // dependencies
  );


  useEffect(() => {
    let isMounted = true;
    if (permittedViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchData, permittedViewFilterData]);

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

  const statsData = [
    { label: "Total Employees", value: StatsData.Total, icon: UsersRound },
    { label: "Managers", value: StatsData.Managers, icon: Contact },
    { label: "Active Employees", value: StatsData.Active, icon: UserRoundCheck },
    { label: "Offboarded Employees", value: StatsData.Exit, icon: UserRoundCheck, },
  ];

  const onEmpStatusChange = (newStatus) => {
    handleFilterChange("employee_status", newStatus === "All" ? "" : newStatus);
    setSelectedStatus(newStatus);
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          AddEmployeesPermitted && (
            <Button
              onClick={(event) => {
                event.preventDefault();
                navigate("/create-employee");
              }}
            >
              Add Employee
            </Button>
          )
        }
      />
      <Stats stats={statsData} />
      <Card>
        <CardHeader className="flex flex-row flex-wrap justify-between gap-2 items-center">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Here you can manage, add, edit and view employee profile and data.
            </CardDescription>
          </div>
          <ImportEmployeesButton reload={fetchData} />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between gap-2 lg:flex-row md:flex-row xl:flex-row mb-4">
            <div className="flex">
              <SelectInputComponent
                name="Employee Status"
                value={selectedStatus}
                placeholder="Employee Status"
                options={employeeStatus}
                onChange={(name, newStatus) => onEmpStatusChange(newStatus)}
                classes="flex-row"
              />
            </div>
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search by ID and Name",
                  name: "emp_search",
                },
                {
                  type: "select",
                  options: Departments,
                  name: "department_name",
                  placeholder: "Department",
                },
                {
                  type: "select",
                  options: Designations,
                  name: "department_position",
                  placeholder: "Designation",
                },
                {
                  type: "select",
                  options: Branches,
                  name: "branch_id",
                  placeholder: "Branch",
                },
                {
                  type: "select",
                  options: UserRoles,
                  name: "user_role",
                  placeholder: "Role",
                },
              ]}
              onChange={handleFilterChange}
              className="justify-end"
            />
          </div>
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={employeeData.results}
              columns={EmployeeColumns}
              pagination={true}
              dataTotalSize={employeeData.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
