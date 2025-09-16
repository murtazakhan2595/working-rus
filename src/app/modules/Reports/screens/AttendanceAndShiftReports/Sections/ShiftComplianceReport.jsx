// ============================================================================
// SHIFT COMPLIANCE REPORT COMPONENT
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
import { getShiftComplianceReportData } from "app/hooks/reports";
import { ShiftComplianceReportColumns } from "../TableColumns/AttendanceShiftTableColumns";

export const ShiftComplianceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [shiftComplianceData, setShiftComplianceData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  const fetchShiftComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftComplianceReportData(payload);
      if (response) {
        setShiftComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching shift compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchShiftComplianceData();
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
    const currentPageData = shiftComplianceData.results || [];
    
    const totalAssignedShifts = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Assigned_Shifts) || 0), 0
    );
    
    const totalDeviations = currentPageData.reduce(
      (sum, item) => sum + (parseInt(item.Deviations) || 0), 0
    );
    
    const highCompliance = currentPageData.filter(
      (item) => {
        const rate = parseFloat(item.Compliance_Rate?.replace("%", "") || 0);
        return rate >= 95;
      }
    ).length;
    
    const lowCompliance = currentPageData.filter(
      (item) => {
        const rate = parseFloat(item.Compliance_Rate?.replace("%", "") || 0);
        return rate < 80;
      }
    ).length;

    return {
      totalEmployees: shiftComplianceData.count || 0,
      totalAssignedShifts,
      totalDeviations,
      highCompliance,
      lowCompliance,
    };
  }, [shiftComplianceData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Tracked employees",
            color: "text-plum-900",
          },
          {
            title: "Assigned Shifts",
            value: stats.totalAssignedShifts,
            description: "Total shifts",
            color: "text-neutral-800",
          },
          {
            title: "Total Deviations",
            value: stats.totalDeviations,
            description: "Shift violations",
            color: "text-red-600",
          },
          {
            title: "High Compliance",
            value: stats.highCompliance,
            description: "95%+ compliance",
            color: "text-green-600",
          },
          {
            title: "Low Compliance",
            value: stats.lowCompliance,
            description: "Under 80%",
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
          <CardTitle>Shift Compliance Report</CardTitle>
          <CardDescription>
            Monitor deviations from allocated shifts to ensure workforce 
            discipline and maintain operational efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ShiftComplianceReportColumns()}
              data={shiftComplianceData.results}
              pagination={true}
              dataTotalSize={shiftComplianceData.count}
              tableOptions={tableOptions}
              fallbackText="No shift compliance data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
