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
// SHIFT COVERAGE REPORT COMPONENT
// ============================================================================
import { getShiftCoverageReportData } from "app/hooks/reports";
import { ShiftCoverageReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftCoverageReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftCoverageData, setShiftCoverageData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchShiftCoverageData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftCoverageReportData(payload);
      if (response) {
        setShiftCoverageData(response);
      }
    } catch (error) {
      console.error("Error fetching shift coverage data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftCoverageData();
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
    const currentPageData = shiftCoverageData.results || [];

    const totalAssignedShifts = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Assigned_Shifts) || 0),
      0
    );

    const totalDeviations = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Deviations) || 0),
      0
    );

    const adequateCoverage = currentPageData.filter((item) => {
      const rate = parseFloat(item.Compliance_Rate?.replace("%", "") || 0);
      return rate >= 90;
    }).length;

    const inadequateCoverage = currentPageData.filter((item) => {
      const rate = parseFloat(item.Compliance_Rate?.replace("%", "") || 0);
      return rate < 70;
    }).length;

    return {
      totalEmployees: shiftCoverageData.count || 0,
      totalAssignedShifts,
      totalDeviations,
      adequateCoverage,
      inadequateCoverage,
    };
  }, [shiftCoverageData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Coverage tracked",
            color: "text-plum-900",
          },
          {
            title: "Assigned Shifts",
            value: stats.totalAssignedShifts,
            description: "Total coverage",
            color: "text-neutral-800",
          },
          {
            title: "Coverage Gaps",
            value: stats.totalDeviations,
            description: "Missing coverage",
            color: "text-red-600",
          },
          {
            title: "Adequate Coverage",
            value: stats.adequateCoverage,
            description: "90%+ coverage",
            color: "text-green-600",
          },
          {
            title: "Poor Coverage",
            value: stats.inadequateCoverage,
            description: "Under 70%",
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
          <CardTitle>Shift Coverage Report</CardTitle>
          <CardDescription>
            Analyze shift coverage gaps and excess manpower to optimize
            workforce distribution and ensure adequate staffing levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftCoverageReportColumns()}
              data={shiftCoverageData.results}
              pagination={true}
              dataTotalSize={shiftCoverageData.count}
              tableOptions={tableOptions}
              fallbackText="No shift coverage data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
