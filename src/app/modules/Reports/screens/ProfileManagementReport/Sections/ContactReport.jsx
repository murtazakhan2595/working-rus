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
import { AlertTriangle } from "lucide-react";
import { getEmployeeReportsData } from "app/hooks/reports";
import { ContactReportColumns } from "../TableColumns/ReportTableColumns";

const ContactReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({ results: [], count: 0 });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("name");

  const fetchContactData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = { filterData: combinedFilters, options, ordering };
      const response = await getEmployeeReportsData(payload);
      if (response) setEmployeeData(response);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchContactData();
    }
  }, [filterData, permittedViewFilterData, options, ordering]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => setOrdering(sortName),
  };

  return (
    <div className="space-y-6">
      {/* Contact Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Contact Report</CardTitle>
          <CardDescription>
            Emergency contact information and dependents details for all
            employees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ContactReportColumns()}
              data={employeeData.results}
              pagination={true}
              dataTotalSize={employeeData.count}
              tableOptions={tableOptions}
              fallbackText="No contact data found"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactReport;
