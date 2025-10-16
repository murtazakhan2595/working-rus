import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getPolicyAcknowledgementData } from "app/hooks/reports";
import { PolicyAcknowledgementColumns } from "../TableColumns/HRDocumentTableColumns";

const PolicyAcknowledgementReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [policyData, setPolicyData] = useState({
    results: [],
    count: 0,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Fetch policy acknowledgement data
  const fetchPolicyData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getPolicyAcknowledgementData(payload);
      if (response) {
        setPolicyData(response);
      }
    } catch (error) {
      console.error("Error fetching policy acknowledgement data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchPolicyData();
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
    const totalRecords = policyData.count || 0;
    const currentPageData = policyData.results || [];

    // Calculate stats from current page data (for display purposes only)
    const completedCount = currentPageData.filter(
      (item) => item.acknowledged === "Yes"
    ).length;
    const pendingCount = currentPageData.filter(
      (item) => item.acknowledged === "No"
    ).length;
    const uniqueEmployees = new Set(
      currentPageData.map((item) => item.employee_id)
    ).size;
    const uniquePolicies = new Set(
      currentPageData
        .map((item) => item.policy_name)
        .filter((policy) => policy && policy !== null)
    ).size;

    const completionRate =
      currentPageData.length > 0
        ? Math.round((completedCount / currentPageData.length) * 100)
        : 0;

    return {
      totalRecords,
      completedCount,
      pendingCount,
      uniqueEmployees,
      uniquePolicies,
      completionRate,
    };
  }, [policyData]);

  return (
    <div className="space-y-6">
      {/* Policy Acknowledgement Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Total Records",
            value: stats.totalRecords,
            description: "Policy acknowledgements",
            color: "text-plum-900",
          },
          {
            title: "Completed",
            value: stats.completedCount,
            description: "Acknowledged (current page)",
            color: "text-green-600",
          },
          {
            title: "Pending",
            value: stats.pendingCount,
            description: "Not acknowledged (current page)",
            color: "text-red-600",
          },
          {
            title: "Completion Rate",
            value: `${stats.completionRate}%`,
            description: "Current page rate",
            color: "text-blue-600",
          },
          {
            title: "Unique Employees",
            value: stats.uniqueEmployees,
            description: "In current view",
            color: "text-purple-600",
          },
          {
            title: "Unique Policies",
            value: stats.uniquePolicies,
            description: "Different policies (current page)",
            color: "text-orange-600",
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

      {/* Policy Acknowledgement Table */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Acknowledgement Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of employee policy acknowledgements including
            HR policies, security protocols, code of conduct, and other
            mandatory organizational policies to ensure compliance and awareness
            across the organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={PolicyAcknowledgementColumns()}
              data={policyData.results}
              pagination={true}
              dataTotalSize={policyData.count}
              tableOptions={tableOptions}
              fallbackText="No policy acknowledgement data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyAcknowledgementReport;
