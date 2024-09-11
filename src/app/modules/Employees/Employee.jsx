import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card.jsx";
import { EmployeeColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import Header from "../../../components/Header";
import { FilterInput } from "components/form-control.jsx";
import { UserRoles } from "data/Data.js";
import { useNavigate } from "react-router-dom";
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
} from "app/hooks/general.jsx";
import { PageLoader } from "components";
import SheetOnBoarding from "../../../components/ui/OnBoardingSheet.jsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../src/@/components/ui/tabs";
import Stats from "../../../components/ui/Stats";

export default function EmployeeManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalManagers, setTotalManager] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = React.useState("");
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
    console.log("Employee Page", options);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getEmployeeCustomList({ options, filterData });
        // console.log(data, "In Employee page")
        setEmployeeData(data);
        setActiveEmployee(data.ActiveEmployee || 0);
        setTotalEmployee(data.TotalEmployee || 0);
        setTotalManager(data.TotalManager || 0);
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
        const departmentResponse = await getDepartmentList();
        setDepartments(departmentResponse);
        const designationResponse = await getDesignationList();
        setDesignations(designationResponse);
      } catch (error) {
        console.error(error);
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

  // Extract unique employee statuses
  const employeeStatuses = [
    "all",
    ...new Set(
      employeeData?.results.map((employee) => employee.employee_status)
    ),
  ];

  const statsData = [
    { label: "Total Employees", value: totalEmployee, icon: UsersRound },
    { label: "Managers", value: totalManagers, icon: Contact },
    { label: "Active Employees", value: activeEmployee, icon: UserRoundCheck },
  ];

  // Add console.log for statsData
  console.log(statsData, "Stats Data");

  // Filter employees based on selected status
  const filteredEmployees = employeeData.results.filter((employee) => {
    if (selectedStatus === "all") return true;
    return employee.employee_status === selectedStatus;
  });

  const employeeStatus = ["All", "Active", "Inactive"];
  console.log(filteredEmployees.length);
  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header content={<SheetOnBoarding />} />
      <Stats stats={statsData} /> {/* Ensure this line is present */}
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={setSelectedStatus}
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="inline-flex items-center justify-center bg-white rounded-full -1 h text-mauve-900">
            {employeeStatuses &&
              employeeStatuses?.map((status) => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="data-[state=active]:bg-plum-500 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
                >
                  {status?.charAt(0).toUpperCase() + status?.slice(1)}
                </TabsTrigger>
              ))}
          </TabsList>
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
        {employeeStatuses.map((status) => (
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
