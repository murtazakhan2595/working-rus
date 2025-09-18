
// File: ShiftUtilizationReport.jsx
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
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getShiftUtilizationReportData } from "app/hooks/reports";
import { ShiftUtilizationColumns } from "../../TableColumns/AdditionalReportsColumns";

const ShiftUtilizationReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [utilizationData, setUtilizationData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-total_employees");

  const shiftColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const fetchUtilizationData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getShiftUtilizationReportData(payload);
      if (response) {
        setUtilizationData(response);
      }
    } catch (error) {
      console.error("Error fetching shift utilization data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchUtilizationData();
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

      {/* Shift Utilization Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Utilization Report</CardTitle>
          <CardDescription>
            Track percentage of workforce in different shifts to identify under/over-utilized shifts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : utilizationData.results.length > 0 ? (
            <TableCustom
              columns={ShiftUtilizationColumns()}
              data={utilizationData.results}
              pagination={true}
              dataTotalSize={utilizationData.count}
              tableOptions={tableOptions}
              fallbackText="No shift utilization data found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No shift utilization data found</p>
              <p className="text-sm mt-2">
                This may indicate that shift assignments are not configured
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftUtilizationReport;
