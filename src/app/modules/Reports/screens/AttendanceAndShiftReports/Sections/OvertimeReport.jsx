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
// OVERTIME REPORT COMPONENT
// ============================================================================
import { getOvertimeReportData } from "app/hooks/reports";
import { OvertimeReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const OvertimeReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [overtimeData, setOvertimeData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchOvertimeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getOvertimeReportData(payload);
      if (response) {
        setOvertimeData(response);
      }
    } catch (error) {
      console.error("Error fetching overtime data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchOvertimeData();
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
    const currentPageData = overtimeData.results || [];

    const totalOvertimeHours = currentPageData.reduce(
      (sum, item) => sum + (parseFloat(item.OvertimeHours) || 0),
      0
    );

    const approvedOvertimes = currentPageData.filter(
      (item) => item.Status === "Approved"
    ).length;

    const pendingOvertimes = currentPageData.filter(
      (item) => item.Status === "Pending"
    ).length;

    const highOvertimeEmployees = currentPageData.filter(
      (item) => parseFloat(item.OvertimeHours) > 20
    ).length;

    return {
      totalEmployees: overtimeData.count || 0,
      totalOvertimeHours: totalOvertimeHours.toFixed(1),
      approvedOvertimes,
      pendingOvertimes,
      highOvertimeEmployees,
    };
  }, [overtimeData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "With overtime",
            color: "text-plum-900",
          },
          {
            title: "Total OT Hours",
            value: `${stats.totalOvertimeHours}h`,
            description: "Sum of overtime",
            color: "text-blue-600",
          },
          {
            title: "Approved",
            value: stats.approvedOvertimes,
            description: "Approved overtime",
            color: "text-green-600",
          },
          {
            title: "Pending",
            value: stats.pendingOvertimes,
            description: "Pending approval",
            color: "text-yellow-600",
          },
          {
            title: "High OT (20h+)",
            value: stats.highOvertimeEmployees,
            description: "Excessive overtime",
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
          <CardTitle>Overtime Report</CardTitle>
          <CardDescription>
            Track overtime hours by employee and approval status for payroll
            processing and workforce cost management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={OvertimeReportColumns()}
              data={overtimeData.results}
              pagination={true}
              dataTotalSize={overtimeData.count}
              tableOptions={tableOptions}
              fallbackText="No overtime data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
