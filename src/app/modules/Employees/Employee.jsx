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

export default function EmployeeManagement() {
  const navigate = useNavigate();
  const AddEmployeesPermitted = HasAccess("ADD_EMPLOYEE");
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [StatsData, setStatsData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const Branches = useSelector((state) => state.common.branches);
  const UserRoles = useSelector((state) => state.roles_permissions.user_roles);
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
    const fetchEmployeeStatData = async (isMounted) => {
      try {
        setIsLoading(true);
        const Stats = await getEmployeeStatsData();
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
    fetchEmployeeStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = useCallback(
    async (isMounted = true) => {
      setIsLoading(true);
      try {
        const data = await getEmployeeCustomList({
          options,
          filterData,
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
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

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
