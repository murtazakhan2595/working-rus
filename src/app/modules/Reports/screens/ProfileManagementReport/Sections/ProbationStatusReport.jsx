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
import { ProbationStatusColumns } from "../TableColumns/ReportTableColumns";

const ProbationStatusReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("probation_end_date");

  const fetchProbationData = async () => {
    setLoading(true);
    try {
      const combinedFilters = {
        ...filterData,
        ...permittedViewFilterData,
        probation_status: filterData.probation_status || "Ongoing,Extended", // Filter for probation employees
      };
      const payload = { filterData: combinedFilters, options, ordering };
      const response = await getEmployeeReportsData(payload);
      if (response) setEmployeeData(response);
    } catch (error) {
      console.error("Error fetching probation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchProbationData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => setOrdering(sortName),
  };

  // Calculate probation stats
  const probationStats = React.useMemo(() => {
    const ongoing = employeeData.results.filter(
      (emp) => emp.probation_status === "Ongoing"
    ).length;
    const completed = employeeData.results.filter(
      (emp) => emp.probation_status === "Completed"
    ).length;
    const extended = employeeData.results.filter(
      (emp) => emp.probation_status === "Extended"
    ).length;

    return { ongoing, completed, extended, total: employeeData.count };
  }, [employeeData.results, employeeData.count]);

  return (
    <div className="space-y-6">
      {/* Probation Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Total on Probation",
            value: probationStats.total,
            color: "text-plum-900",
          },
          {
            title: "Ongoing Probation",
            value: probationStats.ongoing,
            color: "text-yellow-600",
          },
          {
            title: "Completed Probation",
            value: probationStats.completed,
            color: "text-green-600",
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Probation Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Probation Status Report</CardTitle>
          <CardDescription>
            Track employee probation periods, completion status, and
            confirmation eligibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ProbationStatusColumns()}
              data={employeeData.results}
              pagination={true}
              dataTotalSize={employeeData.count}
              tableOptions={tableOptions}
              fallbackText="No probation data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProbationStatusReport;
