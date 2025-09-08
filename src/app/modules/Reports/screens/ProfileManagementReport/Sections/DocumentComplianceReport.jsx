import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { Badge } from "components/ui/badge";
import { AlertTriangle, FileText } from "lucide-react";
import { getDocumentComplianceData } from "app/hooks/reports";
import { DocumentComplianceColumns } from "../TableColumns/ReportTableColumns";

const DocumentComplianceReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("employee_serial_number");

  // Fetch document compliance data
  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const response = await getDocumentComplianceData(combinedFilters);

      if (response) {
        setComplianceData(response);
      }
    } catch (error) {
      console.error("Error fetching document compliance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchComplianceData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  // Handle page changes
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Table options
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

      {/* Document Compliance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Compliance Report</CardTitle>
          <CardDescription>
            Comprehensive document compliance tracking for all employees
            including passport, visa, and Emirates ID validity status with
            automated expiry alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DocumentComplianceColumns()}
              data={complianceData.results}
              pagination={true}
              dataTotalSize={complianceData.count}
              tableOptions={tableOptions}
              fallbackText="Document compliance data will be available once the API is implemented"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentComplianceReport;
