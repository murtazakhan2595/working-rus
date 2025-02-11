import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { EmployeeColumns } from "app/utils/Types/TableColumns";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import Header from "../../../components/Header";
import { FilterInput, SelectComponent } from "components/FormControl";
import { UserRoles, employeeStatus } from "data/Data";
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
} from "app/hooks/general";
import { PageLoader } from "components";
import SheetOnBoarding from "components/ui/OnBoardingSheet";
import Stats from "../../../components/ui/Stats";
import TableCustom from "components/CustomTable";

export default function EmployeeManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalOffboard, setTotalOffboard] = useState(0)
  const [totalManagers, setTotalManagers] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getEmployeeCustomList({ options, filterData });
        setEmployeeData(data);
        setActiveEmployee(data.ActiveEmployee || 0);
        setTotalEmployee(data.TotalEmployee || 0);
        setTotalManagers(data.TotalManager || 0);
        setTotalOffboard(data?.TotalEmployee - data?.ActiveEmployee || 0)
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [options, filterData, selectedStatus]); 

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [departmentResponse, designationResponse] = await Promise.all([
          getDepartmentList(),
          getDesignationList(),
        ]);
        setDepartments(departmentResponse);
        setDesignations(designationResponse);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    fetchLists();
  }, []);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if (filterName === "department_position") setSelectedDesignation(filterValue);
    if (filterName === "user_role") setSelectedRole(filterValue);
    
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
    ? [{ label: "Offboarded Employees", value: totalOffboard, icon: UserRoundCheck }]
    : []),
  ];

  const onEmpStatusChange = (newStatus) => {
    handleFilterChange("employee_status", newStatus === "All" ? "" : newStatus);
    setSelectedStatus(newStatus);
  };

  return (
    <div className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}>
      <Header content={<SheetOnBoarding />} />
      <Stats stats={statsData} />
      <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row gap-2">
        <div className="flex">
        <SelectComponent
          name="Employee Status"
          value={selectedStatus}
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
              name: "id_and_first_name",
            },
            {
              type: "select-one",
              option: departments,
              name: "department_name",
              placeholder: "Department",
              values: selectedDepartment,
            },
            {
              type: "select-two",
              option: designations,
              name: "department_position",
              placeholder: "Designation",
              values: selectedDesignation,
            },
            {
              type: "select-three",
              option: UserRoles,
              name: "user_role",
              placeholder: "Role",
              values: selectedRole,
            },
          ]}
          onChange={handleFilterChange}
        />
      </div>
      {isLoading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <TableCustom
              data={employeeData.results}
              columns={EmployeeColumns}
              pagination={true}
              dataTotalSize={employeeData.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
