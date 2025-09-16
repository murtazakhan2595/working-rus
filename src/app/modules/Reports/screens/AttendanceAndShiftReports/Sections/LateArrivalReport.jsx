import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getLateArrivalReportData } from "app/hooks/reports";
import { LateArrivalReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

const LateArrivalReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [lateArrivalData, setLateArrivalData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Fetch late arrival data
  const fetchLateArrivalData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getLateArrivalReportData(payload);
      if (response) {
        setLateArrivalData(response);
      }
    } catch (error) {
      console.error("Error fetching late arrival data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchLateArrivalData();
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
    const currentPageData = lateArrivalData.results || [];

    const totalLates = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Lates) || 0),
      0
    );

    const totalLateHours = currentPageData.reduce((sum, item) => {
      const hours = parseFloat(item.TotalLateHours?.replace(" hrs", "") || 0);
      return sum + hours;
    }, 0);

    const frequentOffenders = currentPageData.filter(
      (item) => parseInt(item.Lates) > 10
    ).length;

    const moderateIssues = currentPageData.filter((item) => {
      const lates = parseInt(item.Lates);
      return lates > 5 && lates <= 10;
    }).length;

    return {
      totalEmployees: lateArrivalData.count || 0,
      totalLates,
      totalLateHours: totalLateHours.toFixed(1),
      frequentOffenders,
      moderateIssues,
    };
  }, [lateArrivalData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Employees tracked",
            color: "text-plum-900",
          },
          {
            title: "Total Late Arrivals",
            value: stats.totalLates,
            description: "Sum of late arrivals",
            color: "text-yellow-600",
          },
          {
            title: "Total Late Hours",
            value: `${stats.totalLateHours}h`,
            description: "Sum of late hours",
            color: "text-orange-600",
          },
          {
            title: "Frequent Offenders",
            value: stats.frequentOffenders,
            description: "More than 10 lates",
            color: "text-red-600",
          },
          {
            title: "Moderate Issues",
            value: stats.moderateIssues,
            description: "6-10 late arrivals",
            color: "text-yellow-700",
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

      {/* Late Arrival Table */}
      <Card>
        <CardHeader>
          <CardTitle>Late Arrival Report</CardTitle>
          <CardDescription>
            Track late arrivals by employee to identify recurring offenders and
            patterns for improving punctuality and workforce discipline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={LateArrivalReportColumns()}
              data={lateArrivalData.results}
              pagination={true}
              dataTotalSize={lateArrivalData.count}
              tableOptions={tableOptions}
              fallbackText="No late arrival data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LateArrivalReport;
