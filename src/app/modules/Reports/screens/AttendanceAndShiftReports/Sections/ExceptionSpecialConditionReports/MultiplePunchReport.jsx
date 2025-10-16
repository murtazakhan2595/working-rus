// File: MultiplePunchReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getMultiplePunchReportData } from "app/hooks/reports";
import { MultiplePunchColumns } from "../../TableColumns/AdditionalReportsColumns";

const MultiplePunchReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [multiplePunchData, setMultiplePunchData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-total_punches");

  const fetchMultiplePunchData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getMultiplePunchReportData(payload);
      if (response) {
        setMultiplePunchData(response);
      }
    } catch (error) {
      console.error("Error fetching multiple punch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchMultiplePunchData();
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
      {/* Multiple Punch Table */}
      <Card>
        <CardHeader>
          <CardTitle>Multiple Punch Report</CardTitle>
          <CardDescription>
            Employees who punched more than twice on the same day, indicating
            system issues or misuse
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={MultiplePunchColumns()}
              data={multiplePunchData.results}
              pagination={true}
              dataTotalSize={multiplePunchData.count}
              tableOptions={tableOptions}
              fallbackText="No multiple punch records found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplePunchReport;
