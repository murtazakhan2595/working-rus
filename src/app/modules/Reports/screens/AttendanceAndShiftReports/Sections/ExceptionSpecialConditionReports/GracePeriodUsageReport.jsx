// File: GracePeriodUsageReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getGracePeriodUsageReportData } from "app/hooks/reports";
import { GracePeriodUsageColumns } from "../../TableColumns/AdditionalReportsColumns";

const GracePeriodUsageReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [gracePeriodData, setGracePeriodData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-frequency_this_month");

  const fetchGracePeriodData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getGracePeriodUsageReportData(payload);
      if (response) {
        setGracePeriodData(response);
      }
    } catch (error) {
      console.error("Error fetching grace period data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchGracePeriodData();
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
      {/* Grace Period Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grace Period Usage Report</CardTitle>
          <CardDescription>
            Track employees who utilize late arrival grace periods and their
            frequency patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={GracePeriodUsageColumns()}
              data={gracePeriodData.results}
              pagination={true}
              dataTotalSize={gracePeriodData.count}
              tableOptions={tableOptions}
              fallbackText="No grace period usage records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GracePeriodUsageReport;
