// File: AlertsThresholdReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAlertsThresholdReportData } from "app/hooks/reports";
import { AlertsThresholdColumns } from "../../TableColumns/AdditionalReportsColumns";

const AlertsThresholdReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [alertsData, setAlertsData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-late_arrival");

  const fetchAlertsData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAlertsThresholdReportData(payload);
      if (response) {
        setAlertsData(response);
      }
    } catch (error) {
      console.error("Error fetching alerts threshold data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAlertsData();
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



  return (
    <div className="space-y-6">


      {/* Alerts Threshold Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Threshold Report</CardTitle>
          <CardDescription>
            Monitor employees who trigger alerts when attendance thresholds are
            crossed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AlertsThresholdColumns()}
              data={alertsData.results}
              pagination={true}
              dataTotalSize={alertsData.count}
              tableOptions={tableOptions}
              fallbackText="No alerts threshold data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsThresholdReport;
