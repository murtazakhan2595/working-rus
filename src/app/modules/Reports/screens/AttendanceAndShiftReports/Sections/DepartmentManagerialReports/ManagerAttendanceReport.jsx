
// File: ManagerAttendanceReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getManagerAttendanceReportData } from "app/hooks/reports";
import { ManagerAttendanceColumns } from "../../TableColumns/AdditionalReportsColumns";

const ManagerAttendanceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-present");

  const fetchManagerData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getManagerAttendanceReportData(payload);
      if (response) {
        setManagerData(response);
      }
    } catch (error) {
      console.error("Error fetching manager attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchManagerData();
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
      {/* Manager Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Manager-wise Attendance Report</CardTitle>
          <CardDescription>
            View attendance statistics of employees grouped by their reporting managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ManagerAttendanceColumns()}
              data={managerData.results}
              pagination={true}
              dataTotalSize={managerData.count}
              tableOptions={tableOptions}
              fallbackText="No manager attendance data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerAttendanceReport;