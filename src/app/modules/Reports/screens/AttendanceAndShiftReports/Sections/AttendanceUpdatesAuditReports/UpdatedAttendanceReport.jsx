// ============================================================================
// 4️⃣ ATTENDANCE UPDATES & AUDIT REPORTS COMPONENTS
// Create these files in: src/app/modules/Reports/screens/AttendanceAndShiftReports/Sections/AttendanceUpdatesAuditReports/
// ============================================================================

// File: UpdatedAttendanceReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getUpdatedAttendanceReportData } from "app/hooks/reports";
import { UpdatedAttendanceColumns } from "../../TableColumns/AdditionalReportsColumns";

const UpdatedAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [updatedAttendanceData, setUpdatedAttendanceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-update_date");

  const fetchUpdatedAttendanceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getUpdatedAttendanceReportData(payload);
      if (response) {
        setUpdatedAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching updated attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchUpdatedAttendanceData();
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

  // Stats from aggregated data
  const stats = updatedAttendanceData.aggregated_stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Updates",
              value: updatedAttendanceData.count?.toLocaleString() || "0",
              description: "Records updated after initial logging",
              color: "text-blue-600",
            },
            {
              title: "Today's Updates",
              value: stats.today_updates?.toLocaleString() || "0",
              description: "Updates made today",
              color: "text-green-600",
            },
            {
              title: "This Week",
              value: stats.week_updates?.toLocaleString() || "0",
              description: "Updates this week",
              color: "text-purple-600",
            },
            {
              title: "System Updates",
              value: stats.system_updates?.toLocaleString() || "0",
              description: "Automatic updates",
              color: "text-orange-600",
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
      )}

      {/* Updated Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Updated Attendance Report</CardTitle>
          <CardDescription>
            Track all attendance records that have been modified after initial logging
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={UpdatedAttendanceColumns()}
              data={updatedAttendanceData.results}
              pagination={true}
              dataTotalSize={updatedAttendanceData.count}
              tableOptions={tableOptions}
              fallbackText="No updated attendance records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatedAttendanceReport;
