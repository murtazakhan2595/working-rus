import React, { useEffect, useState } from "react";
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
import { PageLoader, Header, TableCustom } from "components";
import Stats from "components/ui/Stats";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import ImportEmployeesButton from "./Screens/Sections/ImportEmployeesButton"; // Adjust the path as needed

export default function EmployeeManagement({ isTeamView = false }) {
  const navigate = useNavigate();
  const AddEmployeesPermitted = HasAccess("ADD_EMPLOYEE");
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalOffboard, setTotalOffboard] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
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
console.log("employeeData", employeeData);
  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getEmployeeCustomList({
        options,
        filterData,
        ordering,
      });
      if (isMounted) {
        setEmployeeData(data || { results: [], count: 0 });
        setEmployeeData(data);
        setActiveEmployee(data.ActiveEmployee || 0);
        setTotalEmployee(data.TotalEmployee || 0);
        setTotalManagers(data.TotalManager || 0);
        setTotalOffboard(data?.TotalEmployee - data?.ActiveEmployee || 0);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

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
    { label: "Total Employees", value: totalEmployee, icon: UsersRound },
    { label: "Managers", value: totalManagers, icon: Contact },
    { label: "Active Employees", value: activeEmployee, icon: UserRoundCheck },
    ...(Object.keys(filterData).length === 0
      ? [
          {
            label: "Offboarded Employees",
            value: totalOffboard,
            icon: UserRoundCheck,
          },
        ]
      : []),
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
          <ImportEmployeesButton reload={fetchData}/>
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
