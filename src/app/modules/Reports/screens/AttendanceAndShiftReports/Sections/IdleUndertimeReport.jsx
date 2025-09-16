// ============================================================================
// IDLE/UNDERTIME REPORT COMPONENT
// ============================================================================
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getIdleUndertimeReportData } from "app/hooks/reports";
import { IdleUndertimeReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const IdleUndertimeReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [idleUndertimeData, setIdleUndertimeData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchIdleUndertimeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getIdleUndertimeReportData(payload);
      if (response) {
        setIdleUndertimeData(response);
      }
    } catch (error) {
      console.error("Error fetching idle undertime data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchIdleUndertimeData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

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

  const stats = React.useMemo(() => {
    const currentPageData = idleUndertimeData.results || [];

    const totalExpectedHours = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.ExpectedHours) || 0),
      0
    );

    const totalWorkedHours = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.WorkedHours) || 0),
      0
    );

    const totalShortfall = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Shortfall) || 0),
      0
    );

    const highShortfall = currentPageData.filter(
      (item) => parseInt(item.Shortfall) > 40
    ).length;

    return {
      totalEmployees: idleUndertimeData.count || 0,
      totalExpectedHours,
      totalWorkedHours,
      totalShortfall,
      highShortfall,
    };
  }, [idleUndertimeData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Employees tracked",
            color: "text-plum-900",
          },
          {
            title: "Expected Hours",
            value: stats.totalExpectedHours,
            description: "Total expected",
            color: "text-neutral-800",
          },
          {
            title: "Worked Hours",
            value: stats.totalWorkedHours,
            description: "Total worked",
            color: "text-blue-600",
          },
          {
            title: "Total Shortfall",
            value: stats.totalShortfall,
            description: "Hours deficit",
            color: "text-red-600",
          },
          {
            title: "High Shortfall",
            value: stats.highShortfall,
            description: "40+ hours short",
            color: "text-red-700",
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

      <Card>
        <CardHeader>
          <CardTitle>Idle/Undertime Report</CardTitle>
          <CardDescription>
            Track employees working less than scheduled hours to identify
            productivity issues and optimize workforce utilization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={IdleUndertimeReportColumns()}
              data={idleUndertimeData.results}
              pagination={true}
              dataTotalSize={idleUndertimeData.count}
              tableOptions={tableOptions}
              fallbackText="No idle/undertime data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
