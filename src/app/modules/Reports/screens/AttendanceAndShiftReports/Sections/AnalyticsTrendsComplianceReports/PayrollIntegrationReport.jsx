

// File: PayrollIntegrationReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getPayrollIntegrationReportData } from "app/hooks/reports";
import { PayrollIntegrationColumns } from "../../TableColumns/AdditionalReportsColumns";

const PayrollIntegrationReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [payrollData, setPayrollData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-employee_id");

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getPayrollIntegrationReportData(payload);
      if (response) {
        setPayrollData(response);
      }
    } catch (error) {
      console.error("Error fetching payroll integration data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchPayrollData();
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
      {/* Payroll Integration Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Integration Report</CardTitle>
          <CardDescription>
            Link attendance data to payroll calculations showing payable days and adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={PayrollIntegrationColumns()}
              data={payrollData.results}
              pagination={true}
              dataTotalSize={payrollData.count}
              tableOptions={tableOptions}
              fallbackText="No payroll integration data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollIntegrationReport;
