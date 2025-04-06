import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { TeamColumns } from "app/modules/TeamManagment/Sections";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import Header from "../../../components/Header";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import { UserRoles, employeeStatus } from "data/Data";
import { getEmployeeCustomList } from "app/hooks/general";
import { PageLoader } from "components";
import SheetOnBoarding from "components/ui/OnBoardingSheet";
import Stats from "../../../components/ui/Stats";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";

export default function TeamProfileMangement() {
  const loggedInUserDetails = useSelector((state) => state.emp.user_details);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [filterData, setFilterData] = useState({
    // department_name: loggedInUserDetails.department_name,
    direct_report: loggedInUserDetails.id,
  });
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalOffboard, setTotalOffboard] = useState(0);
  const [totalManagers, setTotalManagers] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const Designations = useSelector((state) => state.common.designations);
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

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getEmployeeCustomList({
        options,
        filterData,
        ordering,
      });
      console.log("Employee Data", data);
      if (isMounted) {
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
    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if (filterName === "department_position")
      setSelectedDesignation(filterValue);
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
      <Header />
      <Stats stats={statsData} />
      <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row gap-2">
        <div className="flex">
          <SelectInputComponent
            name="Employee Status"
            value={selectedStatus}
            options={employeeStatus}
            onChange={(name, newStatus) => onEmpStatusChange(newStatus)}
            classes="flex-row"
            placeholder="Employee Status"
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
              type: "select-two",
              option: Designations,
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
              columns={TeamColumns}
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
