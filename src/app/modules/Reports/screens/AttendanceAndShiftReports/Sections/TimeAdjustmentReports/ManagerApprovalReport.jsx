import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getManagerApprovalReportData } from "app/hooks/reports";
import { ManagerApprovalColumns } from "../../TableColumns/TimeAdjustmentColumns";


const ManagerApprovalReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState({
    results: [],
    period: null,
  });

  const fetchManagerData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = { filterData: combinedFilters };
      const response = await getManagerApprovalReportData(payload);
      if (response) {
        setManagerData(response);
      }
    } catch (error) {
      console.error("Error fetching manager approval data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchManagerData();
    }
  }, [filterData, permittedViewFilterData]);

  const stats = {
    period: managerData.period || "N/A",
    totalRecords: managerData.results?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Period",
            value: stats.period,
            description: "Report period",
            color: "text-plum-900",
          },
          {
            title: "Total Records",
            value: stats.totalRecords.toLocaleString(),
            description: "Manager records found",
            color: "text-blue-600",
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

      {/* Manager Approval Table */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Approval Report</CardTitle>
          <CardDescription>
            Track approval performance of managers for time adjustment requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : managerData.results.length > 0 ? (
            <TableCustom
              columns={ManagerApprovalColumns()}
              data={managerData.results}
              pagination={false}
              fallbackText="No manager approval data available"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No manager approval data available for the selected period</p>
              <p className="text-sm mt-2">
                Try adjusting your date range or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerApprovalReport;
