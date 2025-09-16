import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getAbsenteeismReportData } from "app/hooks/reports";
import { AbsenteeismReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

const AbsenteeismReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [absenteeismData, setAbsenteeismData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Fetch absenteeism data
  const fetchAbsenteeismData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAbsenteeismReportData(payload);
      if (response) {
        setAbsenteeismData(response);
      }
    } catch (error) {
      console.error("Error fetching absenteeism data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAbsenteeismData();
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

  // Calculate stats from current page data
  const stats = React.useMemo(() => {
    const currentPageData = absenteeismData.results || [];

    const totalAbsents = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Absents) || 0),
      0
    );

    const highAbsenteeism = currentPageData.filter(
      (item) => parseInt(item.Absents) > 5
    ).length;

    const moderateAbsenteeism = currentPageData.filter((item) => {
      const absents = parseInt(item.Absents);
      return absents > 2 && absents <= 5;
    }).length;

    return {
      totalEmployees: absenteeismData.count || 0,
      totalAbsents,
      highAbsenteeism,
      moderateAbsenteeism,
    };
  }, [absenteeismData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Employees tracked",
            color: "text-plum-900",
          },
          {
            title: "Total Absents",
            value: stats.totalAbsents,
            description: "Sum of absent days",
            color: "text-red-600",
          },
          {
            title: "High Absenteeism",
            value: stats.highAbsenteeism,
            description: "More than 5 absents",
            color: "text-red-700",
          },
          {
            title: "Moderate Issues",
            value: stats.moderateAbsenteeism,
            description: "3-5 absent days",
            color: "text-yellow-600",
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

      {/* Absenteeism Table */}
      <Card>
        <CardHeader>
          <CardTitle>Absenteeism Report</CardTitle>
          <CardDescription>
            Track frequent absentees by employee and department to identify
            patterns and take corrective action for improved workforce
            reliability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AbsenteeismReportColumns()}
              data={absenteeismData.results}
              pagination={true}
              dataTotalSize={absenteeismData.count}
              tableOptions={tableOptions}
              fallbackText="No absenteeism data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AbsenteeismReport;
