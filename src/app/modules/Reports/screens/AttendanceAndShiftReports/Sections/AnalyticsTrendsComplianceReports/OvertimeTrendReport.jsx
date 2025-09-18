
// File: OvertimeTrendReport.jsx
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getOvertimeTrendReportData } from "app/hooks/reports";
import { OvertimeTrendColumns } from "../../TableColumns/AdditionalReportsColumns";

const OvertimeTrendReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [overtimeData, setOvertimeData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-total_ot_hours");

  const fetchOvertimeData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getOvertimeTrendReportData(payload);
      if (response) {
        setOvertimeData(response);
      }
    } catch (error) {
      console.error("Error fetching overtime trend data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchOvertimeData();
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

      {/* Overtime Trend Table */}
      <Card>
        <CardHeader>
          <CardTitle>Overtime Trend Report</CardTitle>
          <CardDescription>
            Track overtime hours trends by department and identify employees exceeding limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={OvertimeTrendColumns()}
              data={overtimeData.results}
              pagination={true}
              dataTotalSize={overtimeData.count}
              tableOptions={tableOptions}
              fallbackText="No overtime trend data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OvertimeTrendReport;