
// File: AuditTrailReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getAuditTrailReportData } from "app/hooks/reports";
import { AuditTrailColumns } from "../../TableColumns/AdditionalReportsColumns";

const AuditTrailReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [auditTrailData, setAuditTrailData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-timestamp");

  const fetchAuditTrailData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAuditTrailReportData(payload);
      if (response) {
        setAuditTrailData(response);
      }
    } catch (error) {
      console.error("Error fetching audit trail data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAuditTrailData();
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
  const stats = auditTrailData.aggregated_stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Changes",
              value: auditTrailData.count?.toLocaleString() || "0",
              description: "All audit trail records",
              color: "text-blue-600",
            },
            {
              title: "Updates",
              value: stats.total_updates?.toLocaleString() || "0",
              description: "Update actions logged",
              color: "text-yellow-600",
            },
            {
              title: "Creates",
              value: stats.total_creates?.toLocaleString() || "0",
              description: "Create actions logged",
              color: "text-green-600",
            },
            {
              title: "Deletes",
              value: stats.total_deletes?.toLocaleString() || "0",
              description: "Delete actions logged",
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
      )}

      {/* Audit Trail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail Report</CardTitle>
          <CardDescription>
            Complete audit log showing who changed what, when, and why for accountability
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AuditTrailColumns()}
              data={auditTrailData.results}
              pagination={true}
              dataTotalSize={auditTrailData.count}
              tableOptions={tableOptions}
              fallbackText="No audit trail records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailReport;
