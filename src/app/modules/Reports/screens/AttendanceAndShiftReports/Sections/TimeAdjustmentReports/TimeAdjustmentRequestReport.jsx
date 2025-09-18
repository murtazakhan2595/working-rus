import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getTimeAdjustmentReportData } from "app/hooks/reports";
import { TimeAdjustmentRequestColumns } from "../../TableColumns/TimeAdjustmentColumns";


const TimeAdjustmentRequestReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [timeAdjustmentData, setTimeAdjustmentData] = useState({
    results: [],
    count: 0,
    period: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-Request_ID");

  const fetchTimeAdjustmentData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getTimeAdjustmentReportData(payload);
      if (response) {
        setTimeAdjustmentData(response);
      }
    } catch (error) {
      console.error("Error fetching time adjustment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchTimeAdjustmentData();
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
      {/* Time Adjustment Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Adjustment Request Report</CardTitle>
          <CardDescription>
            Track all employee-initiated time adjustment requests including
            status, reasons, and approval workflow for better attendance
            management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={TimeAdjustmentRequestColumns()}
              data={timeAdjustmentData.results}
              pagination={true}
              dataTotalSize={timeAdjustmentData.count}
              tableOptions={tableOptions}
              fallbackText="No time adjustment requests found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeAdjustmentRequestReport;
