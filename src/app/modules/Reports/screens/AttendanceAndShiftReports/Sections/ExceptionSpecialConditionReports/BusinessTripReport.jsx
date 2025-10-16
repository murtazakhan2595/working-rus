// File: BusinessTripReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getBusinessTripReportData } from "app/hooks/reports";
import { BusinessTripColumns } from "../../TableColumns/AdditionalReportsColumns";

const BusinessTripReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [businessTripData, setBusinessTripData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-date");

  const fetchBusinessTripData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getBusinessTripReportData(payload);
      if (response) {
        setBusinessTripData(response);
      }
    } catch (error) {
      console.error("Error fetching business trip data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchBusinessTripData();
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
      {/* Business Trip Table */}
      <Card>
        <CardHeader>
          <CardTitle>Business Trip Report</CardTitle>
          <CardDescription>
            Track employees on official travel duty instead of regular office
            shifts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : businessTripData.results.length > 0 ? (
            <TableCustom
              columns={BusinessTripColumns()}
              data={businessTripData.results}
              pagination={true}
              dataTotalSize={businessTripData.count}
              tableOptions={tableOptions}
              fallbackText="No business trip records found"
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No business trip records found</p>
              <p className="text-sm mt-2">
                No employees are currently on business travel duty
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessTripReport;
