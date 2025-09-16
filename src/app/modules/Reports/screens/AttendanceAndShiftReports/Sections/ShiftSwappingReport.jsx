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
// SHIFT SWAPPING REPORT COMPONENT
// ============================================================================
import { getShiftSwappingReportData } from "app/hooks/reports";
import { ShiftSwappingReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftSwappingReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftSwappingData, setShiftSwappingData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchShiftSwappingData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftSwappingReportData(payload);
      if (response) {
        setShiftSwappingData(response);
      }
    } catch (error) {
      console.error("Error fetching shift swapping data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftSwappingData();
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
    const currentPageData = shiftSwappingData.results || [];

    const approvedSwaps = currentPageData.filter(
      (item) => item.Status === "Approved"
    ).length;

    const pendingSwaps = currentPageData.filter(
      (item) => item.Status === "Pending"
    ).length;

    const rejectedSwaps = currentPageData.filter(
      (item) => item.Status === "Rejected"
    ).length;

    return {
      totalRequests: shiftSwappingData.count || 0,
      approvedSwaps,
      pendingSwaps,
      rejectedSwaps,
    };
  }, [shiftSwappingData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Requests",
            value: stats.totalRequests,
            description: "Swap requests",
            color: "text-plum-900",
          },
          {
            title: "Approved",
            value: stats.approvedSwaps,
            description: "Approved swaps",
            color: "text-green-600",
          },
          {
            title: "Pending",
            value: stats.pendingSwaps,
            description: "Awaiting approval",
            color: "text-yellow-600",
          },
          {
            title: "Rejected",
            value: stats.rejectedSwaps,
            description: "Rejected requests",
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
          <CardTitle>Shift Swapping Report</CardTitle>
          <CardDescription>
            Track approved and rejected shift swap requests to manage employee
            flexibility while maintaining operational requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftSwappingReportColumns()}
              data={shiftSwappingData.results}
              pagination={true}
              dataTotalSize={shiftSwappingData.count}
              tableOptions={tableOptions}
              fallbackText="No shift swapping data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
