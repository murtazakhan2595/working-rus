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
// HOLIDAY SPECIAL SHIFT REPORT COMPONENT
// ============================================================================
import { getHolidaySpecialShiftReportData } from "app/hooks/reports";
import { HolidaySpecialShiftReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const HolidaySpecialShiftReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [holidaySpecialData, setHolidaySpecialData] = useState({
    month: "",
    results: [],
  });

  const fetchHolidaySpecialData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
      };

      const response = await getHolidaySpecialShiftReportData(payload);
      if (response) {
        setHolidaySpecialData(response);
      }
    } catch (error) {
      console.error("Error fetching holiday special shift data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchHolidaySpecialData();
    }
  }, [filterData, permittedViewFilterData]);

  const stats = React.useMemo(() => {
    const resultsData = holidaySpecialData.results || [];

    const totalHolidayShifts = resultsData.length;

    const specialAssignments = resultsData.filter((item) =>
      item["Holiday/Special"]?.includes("Special")
    ).length;

    const holidayAssignments = resultsData.filter(
      (item) =>
        item["Holiday/Special"]?.includes("Holiday") ||
        item["Holiday/Special"]?.includes("Day")
    ).length;

    const uniqueStaff = new Set(resultsData.map((item) => item.Assigned_Staff))
      .size;

    return {
      month: holidaySpecialData.month || "N/A",
      totalHolidayShifts,
      specialAssignments,
      holidayAssignments,
      uniqueStaff,
    };
  }, [holidaySpecialData]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Report Month",
            value: stats.month,
            description: "Reporting period",
            color: "text-plum-900",
          },
          {
            title: "Total Shifts",
            value: stats.totalHolidayShifts,
            description: "Holiday/special shifts",
            color: "text-blue-600",
          },
          {
            title: "Special Assignments",
            value: stats.specialAssignments,
            description: "Special duty shifts",
            color: "text-purple-600",
          },
          {
            title: "Holiday Assignments",
            value: stats.holidayAssignments,
            description: "Holiday shifts",
            color: "text-orange-600",
          },
          {
            title: "Unique Staff",
            value: stats.uniqueStaff,
            description: "Staff assigned",
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
              <p className="text-xs text-neutral-800 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Holiday Special Shift Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holiday & Special Shift Report</CardTitle>
          <CardDescription>
            Track staff assigned to work on holidays and special occasions for
            proper compensation and workforce management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={HolidaySpecialShiftReportColumns()}
              data={holidaySpecialData.results}
              pagination={false}
              fallbackText="No holiday/special shift data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
