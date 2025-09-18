import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getRepeatAdjustmentReportData } from "app/hooks/reports";
import { RepeatAdjustmentColumns } from "../../TableColumns/TimeAdjustmentColumns";

const RepeatAdjustmentReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [repeatData, setRepeatData] = useState({
    results: [],
    period: null,
  });

  const fetchRepeatData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = { filterData: combinedFilters };
      const response = await getRepeatAdjustmentReportData(payload);
      if (response) {
        setRepeatData(response);
      }
    } catch (error) {
      console.error("Error fetching repeat adjustment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchRepeatData();
    }
  }, [filterData, permittedViewFilterData]);

  const stats = {
    period: repeatData.period || "N/A",
    totalRecords: repeatData.results?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Repeat Adjustment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Repeat Adjustment Report</CardTitle>
          <CardDescription>
            Identify employees frequently requesting time adjustments for
            monitoring and guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : repeatData.results.length > 0 ? (
            <TableCustom
              columns={RepeatAdjustmentColumns()}
              data={repeatData.results}
              pagination={false}
              fallbackText="No repeat adjustment data available"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No repeat adjustment data available for the selected period</p>
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

export default RepeatAdjustmentReport;
