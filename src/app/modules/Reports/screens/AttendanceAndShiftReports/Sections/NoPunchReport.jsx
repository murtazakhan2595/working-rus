import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
// ============================================================================
// NO PUNCH REPORT COMPONENT
// ============================================================================
import { getNoPunchReportData } from "app/hooks/reports";
import { NoPunchReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const NoPunchReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [noPunchData, setNoPunchData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchNoPunchData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getNoPunchReportData(payload);
      if (response) {
        setNoPunchData(response);
      }
    } catch (error) {
      console.error("Error fetching no punch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchNoPunchData();
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
    const currentPageData = noPunchData.results || [];

    const checkInMissing = currentPageData.filter(
      (item) => item.DatesMissing === "Check-in"
    ).length;

    const checkOutMissing = currentPageData.filter(
      (item) => item.DatesMissing === "Check-out"
    ).length;

    const bothMissing = currentPageData.filter(
      (item) => item.DatesMissing === "Both Missing"
    ).length;

    return {
      totalRecords: noPunchData.count || 0,
      checkInMissing,
      checkOutMissing,
      bothMissing,
    };
  }, [noPunchData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords,
            description: "Missing punch records",
            color: "text-plum-900",
          },
          {
            title: "Check-in Missing",
            value: stats.checkInMissing,
            description: "Missing check-in",
            color: "text-yellow-600",
          },
          {
            title: "Check-out Missing",
            value: stats.checkOutMissing,
            description: "Missing check-out",
            color: "text-orange-600",
          },
          {
            title: "Both Missing",
            value: stats.bothMissing,
            description: "Both punches missing",
            color: "text-red-600",
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
          <CardTitle>No Punch Report</CardTitle>
          <CardDescription>
            Identify employees who missed biometric punches to ensure accurate
            attendance tracking and resolve system issues promptly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={NoPunchReportColumns()}
              data={noPunchData.results}
              pagination={true}
              dataTotalSize={noPunchData.count}
              tableOptions={tableOptions}
              fallbackText="No missing punch data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
