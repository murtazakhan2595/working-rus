import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { EmployeeColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import Header from "../../../components/Header";
import { FilterInput, SelectComponent } from "components/form-control";
import { UserRoles } from "data/Data";
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
} from "app/hooks/general";
import { PageLoader } from "components";
import SheetOnBoarding from "../../../components/ui/OnBoardingSheet";
import { Tabs, TabsContent } from "../../../src/@/components/ui/tabs";
import Stats from "../../../components/ui/Stats";

export default function EmployeeManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [empStatuses, setEmpStatuses] = useState(["all"]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

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
        setFilteredEmployees(
          data.results.filter((employee) =>
            selectedStatus === "all"
              ? true
              : employee.employee_status === selectedStatus
          )
        );
        setActiveEmployee(data.ActiveEmployee || 0);
        setTotalEmployee(data.TotalEmployee || 0);
        setTotalManagers(data.TotalManager || 0);
        setEmpStatuses([
          "all",
          ...new Set(data.results.map((e) => e.employee_status)),
        ]);
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
  ];

  const onEmpStatusChange = (newStatus) => {
    setFilteredEmployees(
      employeeData.results.filter((employee) =>
        newStatus === "all" ? true : employee.employee_status === newStatus
      )
    );
    setSelectedStatus(newStatus);
  };

  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header content={<SheetOnBoarding />} />
      <Stats stats={statsData} />
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={setSelectedStatus}
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <SelectComponent
            name="Employee Status"
            value={selectedStatus}
            options={empStatuses.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            }))}
            onChange={(name, newStatus) => onEmpStatusChange(newStatus)}
            classes="flex-row"
          />
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
              },
              {
                type: "select-two",
                option: designations,
                name: "department_position",
                placeholder: "Designation",
              },
              {
                type: "select-three",
                option: UserRoles,
                name: "user_role",
                placeholder: "Role",
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        {empStatuses.map((status) => (
          <TabsContent key={status} value={status}>
            {isLoading ? (
              <PageLoader />
            ) : (
              <Card>
                <CardContent>
                  <CustomTable
                    data={filteredEmployees}
                    columns={EmployeeColumns}
                    pagination={true}
                    dataTotalSize={employeeData.count || 0}
                    tableOptions={tableOptions}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
