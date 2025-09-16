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
// ATTENDANCE VS LEAVE REPORT COMPONENT
// ============================================================================
import { getAttendanceVsLeaveReportData } from "app/hooks/reports";
import { AttendanceVsLeaveReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const AttendanceVsLeaveReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [attendanceVsLeaveData, setAttendanceVsLeaveData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchAttendanceVsLeaveData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAttendanceVsLeaveReportData(payload);
      if (response) {
        setAttendanceVsLeaveData(response);
      }
    } catch (error) {
      console.error("Error fetching attendance vs leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAttendanceVsLeaveData();
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
    const currentPageData = attendanceVsLeaveData.results || [];

    const conflictsFound = currentPageData.filter(
      (item) => item.Conflict === "Yes"
    ).length;

    const noConflicts = currentPageData.filter(
      (item) => item.Conflict === "No"
    ).length;

    const presentWithLeave = currentPageData.filter(
      (item) => item.AttendanceStatus === "Present" && item.LeaveType !== "None"
    ).length;

    return {
      totalRecords: attendanceVsLeaveData.count || 0,
      conflictsFound,
      noConflicts,
      presentWithLeave,
    };
  }, [attendanceVsLeaveData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords,
            description: "Records analyzed",
            color: "text-plum-900",
          },
          {
            title: "Conflicts Found",
            value: stats.conflictsFound,
            description: "Leave vs attendance",
            color: "text-red-600",
          },
          {
            title: "No Conflicts",
            value: stats.noConflicts,
            description: "Records consistent",
            color: "text-green-600",
          },
          {
            title: "Present with Leave",
            value: stats.presentWithLeave,
            description: "Potential issues",
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

      <Card>
        <CardHeader>
          <CardTitle>Attendance vs Leave Report</CardTitle>
          <CardDescription>
            Identify conflicts between attendance records and leave applications
            to ensure data accuracy and prevent payroll discrepancies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AttendanceVsLeaveReportColumns()}
              data={attendanceVsLeaveData.results}
              pagination={true}
              dataTotalSize={attendanceVsLeaveData.count}
              tableOptions={tableOptions}
              fallbackText="No attendance vs leave data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
