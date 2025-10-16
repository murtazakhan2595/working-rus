
// File: ComplianceBreachReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getComplianceBreachReportData } from "app/hooks/reports";
import { ComplianceBreachColumns } from "../../TableColumns/AdditionalReportsColumns";

const ComplianceBreachReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-timestamp");

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getComplianceBreachReportData(payload);
      if (response) {
        setComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching compliance breach data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchComplianceData();
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
  const stats = complianceData.aggregated_stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Breaches",
              value: complianceData.count?.toLocaleString() || "0",
              description: "Compliance breaches detected",
              color: "text-red-600",
            },
            {
              title: "Approved",
              value: stats.approved_breaches?.toLocaleString() || "0",
              description: "Approved breaches",
              color: "text-green-600",
            },
            {
              title: "Updated",
              value: stats.updated_breaches?.toLocaleString() || "0",
              description: "Updated breaches",
              color: "text-yellow-600",
            },
            {
              title: "High Risk",
              value: stats.high_risk_breaches?.toLocaleString() || "0",
              description: "High-risk violations",
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

      {/* Compliance Breach Table */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Breach Report</CardTitle>
          <CardDescription>
            Detect and track irregular changes that may indicate policy violations or fraud
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : complianceData.results.length > 0 ? (
            <TableCustom
              columns={ComplianceBreachColumns()}
              data={complianceData.results}
              pagination={true}
              dataTotalSize={complianceData.count}
              tableOptions={tableOptions}
              fallbackText="No compliance breaches found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No compliance breaches detected for the selected period</p>
              <p className="text-sm mt-2">
                This indicates good compliance with attendance policies
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceBreachReport;
