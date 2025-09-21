// File: HalfDayReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getHalfDayReportData } from "app/hooks/reports";
import { HalfDayColumns } from "../../TableColumns/AdditionalReportsColumns";

const HalfDayReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [halfDayData, setHalfDayData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-date");

  const fetchHalfDayData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getHalfDayReportData(payload);
      if (response) {
        setHalfDayData(response);
      }
    } catch (error) {
      console.error("Error fetching half day data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchHalfDayData();
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
  const stats = halfDayData.aggregated_stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Half Days",
              value: halfDayData.count?.toLocaleString() || "0",
              description: "Partial shift records",
              color: "text-blue-600",
            },
            {
              title: "Approved",
              value: stats.approved_half_days?.toLocaleString() || "0",
              description: "Approved half days",
              color: "text-green-600",
            },
            {
              title: "Unapproved",
              value: stats.unapproved_half_days?.toLocaleString() || "0",
              description: "Unapproved half days",
              color: "text-red-600",
            },
            {
              title: "Avg Hours",
              value: stats.avg_hours?.toFixed(1) || "0.0",
              description: "Average worked hours",
              color: "text-purple-600",
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

      {/* Half Day Table */}
      <Card>
        <CardHeader>
          <CardTitle>Half Day Report</CardTitle>
          <CardDescription>
            Employees who worked partial shifts - track approved vs unapproved
            instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={HalfDayColumns()}
              data={halfDayData.results}
              pagination={true}
              dataTotalSize={halfDayData.count}
              tableOptions={tableOptions}
              fallbackText="No half day records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HalfDayReport;
