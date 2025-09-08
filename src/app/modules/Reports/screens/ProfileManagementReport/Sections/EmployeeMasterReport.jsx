import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getEmployeeReportsData } from "app/hooks/reports";
import { EmployeeMasterColumns } from "../TableColumns/ReportTableColumns";

const EmployeeMasterReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("serial_number");

  // Fetch employee data
  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getEmployeeReportsData(payload);
      if (response) {
        setEmployeeData(response);
      }
    } catch (error) {
      console.error("Error fetching employee master data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchEmployeeData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  // Handle page changes
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Table options
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  console.log("employeemsterreport employeeData", employeeData);
console.log("Full employeeData object:", employeeData);
console.log("on_leave_employees:", employeeData.on_leave_employees);
console.log("on_probation_employees:", employeeData.on_probation_employees);
  // Calculate stats
  const stats = {
    totalEmployees: employeeData.count || 0,
    activeEmployees: employeeData.ActiveEmployee || 0,
    onLeave: employeeData.on_leave_employees || 0,
    probation: employeeData.on_probation_employees || 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "All employees in system",
            color: "text-plum-900",
          },
          {
            title: "Active Employees",
            value: stats.activeEmployees,
            description: "Currently active",
            color: "text-green-600",
          },
          {
            title: "On Leave",
            value: stats.onLeave,
            description: "Currently on leave",
            color: "text-yellow-600",
          },
          {
            title: "On Probation",
            value: stats.probation,
            description: "Probation period",
            color: "text-blue-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Employee Master Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Master Report</CardTitle>
          <CardDescription>
            Complete listing of all employees with their core information
            including ID, designation, department, location, and employment
            details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={EmployeeMasterColumns()}
              data={employeeData.results}
              pagination={true}
              dataTotalSize={employeeData.count}
              tableOptions={tableOptions}
              fallbackText="No employees found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeMasterReport;
