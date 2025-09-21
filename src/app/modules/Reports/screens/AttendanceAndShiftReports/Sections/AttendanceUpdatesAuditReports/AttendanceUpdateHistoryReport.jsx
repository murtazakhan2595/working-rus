// File: AttendanceUpdateHistoryReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getAttendanceUpdateHistoryData } from "app/hooks/reports";
import { AttendanceUpdateHistoryColumns } from "../../TableColumns/AdditionalReportsColumns";

const AttendanceUpdateHistoryReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [updateHistoryData, setUpdateHistoryData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-modified_on");

  const fetchUpdateHistoryData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getAttendanceUpdateHistoryData(payload);
      if (response) {
        setUpdateHistoryData(response);
      }
    } catch (error) {
      console.error("Error fetching update history data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchUpdateHistoryData();
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
      {/* Attendance Update History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Update History Report</CardTitle>
          <CardDescription>
            Versioned log showing how attendance records evolved over time with
            complete modification history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={AttendanceUpdateHistoryColumns()}
              data={updateHistoryData.results}
              pagination={true}
              dataTotalSize={updateHistoryData.count}
              tableOptions={tableOptions}
              fallbackText="No update history records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceUpdateHistoryReport;
