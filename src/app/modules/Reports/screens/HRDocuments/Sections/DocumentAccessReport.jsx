import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getDocumentAccessData } from "app/hooks/reports";
import { DocumentAccessColumns } from "../TableColumns/HRDocumentTableColumns";

const DocumentAccessReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [accessData, setAccessData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Fetch document access data
  const fetchAccessData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getDocumentAccessData(payload);
      if (response) {
        setAccessData(response);
      }
    } catch (error) {
      console.error("Error fetching document access data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchAccessData();
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

  // Calculate simple stats from current data
  const stats = React.useMemo(() => {
    const totalRecords = accessData.count || 0;
    const currentPageData = accessData.results || [];

    // Calculate stats from current page data (for display purposes only)
    const activeDocuments = currentPageData.filter(
      (item) => item.is_active
    ).length;
    const uniqueEmployees = new Set(
      currentPageData.map((item) => item.employee_id)
    ).size;
    const uniqueDocumentTypes = new Set(
      currentPageData.map((item) => item.document_name)
    ).size;

    return {
      totalRecords,
      activeDocuments: activeDocuments,
      uniqueEmployees: uniqueEmployees,
      uniqueDocumentTypes: uniqueDocumentTypes,
    };
  }, [accessData]);

  return (
    <div className="space-y-6">
      {/* Document Access Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords,
            description: "Access records tracked",
            color: "text-plum-900",
          },
          {
            title: "Active Documents",
            value: stats.activeDocuments,
            description: "Currently active (current page)",
            color: "text-green-600",
          },
          {
            title: "Unique Employees",
            value: stats.uniqueEmployees,
            description: "In current view",
            color: "text-blue-600",
          },
          {
            title: "Document Types",
            value: stats.uniqueDocumentTypes,
            description: "Different types (current page)",
            color: "text-purple-600",
          },
        ].map((stat, index) => (
          <Card
            key={index}
            className="flex flex-col justify-center shadow-md border rounded-lg"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-neutral-900">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-neutral-800 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Access Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Access Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of document access permissions and history
            including employee information, document types, expiry status, and
            current access permissions for security and compliance monitoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DocumentAccessColumns()}
              data={accessData.results}
              pagination={true}
              dataTotalSize={accessData.count}
              tableOptions={tableOptions}
              fallbackText="No document access data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentAccessReport;
