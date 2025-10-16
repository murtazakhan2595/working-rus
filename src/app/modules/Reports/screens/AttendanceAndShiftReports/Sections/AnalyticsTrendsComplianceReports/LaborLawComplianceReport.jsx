
// File: LaborLawComplianceReport.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getLaborLawComplianceReportData } from "app/hooks/reports";
import { LaborLawComplianceColumns } from "../../TableColumns/AdditionalReportsColumns";

const LaborLawComplianceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-total_hours");

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getLaborLawComplianceReportData(payload);
      if (response) {
        setComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching labor law compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchComplianceData();
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
      {/* Labor Law Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>UAE Labor Law Compliance Report</CardTitle>
          <CardDescription>
            Ensure working hours, overtime, and weekly offs comply with UAE labor law requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={LaborLawComplianceColumns()}
              data={complianceData.results}
              pagination={true}
              dataTotalSize={complianceData.count}
              tableOptions={tableOptions}
              fallbackText="No labor law compliance data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LaborLawComplianceReport;