
// File: HRAdminCorrectionReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getHRAdminCorrectionReportData } from "app/hooks/reports";
import { HRAdminCorrectionColumns } from "../../TableColumns/AdditionalReportsColumns";

const HRAdminCorrectionReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [hrCorrectionData, setHrCorrectionData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-changed_date");

  const fetchHRCorrectionData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getHRAdminCorrectionReportData(payload);
      if (response) {
        setHrCorrectionData(response);
      }
    } catch (error) {
      console.error("Error fetching HR correction data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchHRCorrectionData();
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
      {/* HR/Admin Correction Table */}
      <Card>
        <CardHeader>
          <CardTitle>HR/Admin Correction Report</CardTitle>
          <CardDescription>
            Manual changes made by HR administrators for attendance correction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : hrCorrectionData.results.length > 0 ? (
            <TableCustom
              columns={HRAdminCorrectionColumns()}
              data={hrCorrectionData.results}
              pagination={true}
              dataTotalSize={hrCorrectionData.count}
              tableOptions={tableOptions}
              fallbackText="No HR/Admin corrections found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No HR/Admin corrections found for the selected period</p>
              <p className="text-sm mt-2">
                This indicates that the attendance data is accurate and no manual corrections were needed
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HRAdminCorrectionReport;
