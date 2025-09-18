// ============================================================================
// 5️⃣ EXCEPTION & SPECIAL CONDITION REPORTS COMPONENTS
// Create these files in: src/app/modules/Reports/screens/AttendanceAndShiftReports/Sections/ExceptionSpecialConditionReports/
// ============================================================================

// File: MissingPunchReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getMissingPunchReportData } from "app/hooks/reports";
import { MissingPunchColumns } from "../../TableColumns/AdditionalReportsColumns";

const MissingPunchReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [missingPunchData, setMissingPunchData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-date");

  const fetchMissingPunchData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getMissingPunchReportData(payload);
      if (response) {
        setMissingPunchData(response);
      }
    } catch (error) {
      console.error("Error fetching missing punch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchMissingPunchData();
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
  const stats = missingPunchData.aggregated_stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Missing",
              value: missingPunchData.count?.toLocaleString() || "0",
              description: "Missing punch records",
              color: "text-red-600",
            },
            {
              title: "Missing IN",
              value: stats.missing_in?.toLocaleString() || "0",
              description: "Missing check-in punches",
              color: "text-orange-600",
            },
            {
              title: "Missing OUT",
              value: stats.missing_out?.toLocaleString() || "0",
              description: "Missing check-out punches",
              color: "text-yellow-600",
            },
            {
              title: "Both Missing",
              value: stats.both_missing?.toLocaleString() || "0",
              description: "Both punches missing",
              color: "text-red-800",
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

      {/* Missing Punch Table */}
      <Card>
        <CardHeader>
          <CardTitle>Missing Punch Report</CardTitle>
          <CardDescription>
            Identify employees with missing check-in or check-out punches for attendance correction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={MissingPunchColumns()}
              data={missingPunchData.results}
              pagination={true}
              dataTotalSize={missingPunchData.count}
              tableOptions={tableOptions}
              fallbackText="No missing punch records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MissingPunchReport;





