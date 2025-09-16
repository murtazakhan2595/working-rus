// ============================================================================
// EARLY DEPARTURE REPORT COMPONENT
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
import { getEarlyDepartureReportData } from "app/hooks/reports";
import { EarlyDepartureReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const EarlyDepartureReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [earlyDepartureData, setEarlyDepartureData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchEarlyDepartureData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getEarlyDepartureReportData(payload);
      if (response) {
        setEarlyDepartureData(response);
      }
    } catch (error) {
      console.error("Error fetching early departure data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchEarlyDepartureData();
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
    const currentPageData = earlyDepartureData.results || [];

    const totalEarlyExits = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.EarlyExits) || 0),
      0
    );

    const totalTimeLost = currentPageData.reduce(
      (sum, item) => sum + (parseFloat(item.TimeLost) || 0),
      0
    );

    const frequentEarlyExits = currentPageData.filter(
      (item) => parseInt(item.EarlyExits) > 5
    ).length;

    return {
      totalEmployees: earlyDepartureData.count || 0,
      totalEarlyExits,
      totalTimeLost: totalTimeLost.toFixed(1),
      frequentEarlyExits,
    };
  }, [earlyDepartureData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Employees tracked",
            color: "text-plum-900",
          },
          {
            title: "Total Early Exits",
            value: stats.totalEarlyExits,
            description: "Sum of early exits",
            color: "text-orange-600",
          },
          {
            title: "Total Time Lost",
            value: `${stats.totalTimeLost}h`,
            description: "Hours lost",
            color: "text-red-600",
          },
          {
            title: "Frequent Early Exits",
            value: stats.frequentEarlyExits,
            description: "More than 5 exits",
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
          <CardTitle>Early Departure Report</CardTitle>
          <CardDescription>
            Track early departures to identify patterns and calculate time lost
            for better workforce planning and productivity management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={EarlyDepartureReportColumns()}
              data={earlyDepartureData.results}
              pagination={true}
              dataTotalSize={earlyDepartureData.count}
              tableOptions={tableOptions}
              fallbackText="No early departure data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

