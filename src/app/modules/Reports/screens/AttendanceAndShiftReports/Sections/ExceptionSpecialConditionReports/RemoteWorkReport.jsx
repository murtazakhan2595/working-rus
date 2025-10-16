// File: RemoteWorkReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getRemoteWorkReportData } from "app/hooks/reports";
import { RemoteWorkColumns } from "../../TableColumns/AdditionalReportsColumns";

const RemoteWorkReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [remoteWorkData, setRemoteWorkData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-date");

  const fetchRemoteWorkData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getRemoteWorkReportData(payload);
      if (response) {
        setRemoteWorkData(response);
      }
    } catch (error) {
      console.error("Error fetching remote work data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchRemoteWorkData();
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
      {/* Remote Work Table */}
      <Card>
        <CardHeader>
          <CardTitle>Remote Work Report</CardTitle>
          <CardDescription>
            Track attendance logged from outside office geo-fence boundaries and
            remote locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : remoteWorkData.results.length > 0 ? (
            <TableCustom
              columns={RemoteWorkColumns()}
              data={remoteWorkData.results}
              pagination={true}
              dataTotalSize={remoteWorkData.count}
              tableOptions={tableOptions}
              fallbackText="No remote work records found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No remote work attendance records found</p>
              <p className="text-sm mt-2">
                All employees are working from designated office locations
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RemoteWorkReport;
