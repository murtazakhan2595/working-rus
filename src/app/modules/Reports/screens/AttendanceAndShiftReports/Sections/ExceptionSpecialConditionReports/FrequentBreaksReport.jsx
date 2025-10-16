// File: FrequentBreaksReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getFrequentBreaksReportData } from "app/hooks/reports";
import { FrequentBreaksColumns } from "../../TableColumns/AdditionalReportsColumns";

const FrequentBreaksReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [frequentBreaksData, setFrequentBreaksData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-total_break_duration");

  const fetchFrequentBreaksData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getFrequentBreaksReportData(payload);
      if (response) {
        setFrequentBreaksData(response);
      }
    } catch (error) {
      console.error("Error fetching frequent breaks data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchFrequentBreaksData();
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
      {/* Frequent Breaks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Frequent Breaks Report</CardTitle>
          <CardDescription>
            Monitor employees taking excessive or long breaks beyond policy
            limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={FrequentBreaksColumns()}
              data={frequentBreaksData.results}
              pagination={true}
              dataTotalSize={frequentBreaksData.count}
              tableOptions={tableOptions}
              fallbackText="No frequent breaks records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequentBreaksReport;
