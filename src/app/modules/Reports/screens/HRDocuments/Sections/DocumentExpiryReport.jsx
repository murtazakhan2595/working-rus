import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { getDocumentExpiryData } from "app/hooks/reports";
import { DocumentExpiryColumns } from "../TableColumns/HRDocumentTableColumns";

const DocumentExpiryReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [expiryData, setExpiryData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#F59E0B", "#EF4444"];
  const documentColors = [
    "#3B82F6",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
  ];

  // Fetch document expiry data
  const fetchExpiryData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getDocumentExpiryData(payload);
      if (response) {
        setExpiryData(response);
      }
    } catch (error) {
      console.error("Error fetching document expiry data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchExpiryData();
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

  // Prepare chart data from aggregated stats
  const statusChartData = React.useMemo(() => {
    if (!expiryData.aggregated_stats?.status_breakdown) return [];

    return Object.entries(expiryData.aggregated_stats.status_breakdown)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          expiryData.aggregated_stats.total_documents > 0
            ? Math.round(
                (count / expiryData.aggregated_stats.total_documents) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [expiryData.aggregated_stats]);

  // Document type chart data
  const documentTypeChartData = React.useMemo(() => {
    if (!expiryData.aggregated_stats?.document_type_breakdown) return [];

    return Object.entries(expiryData.aggregated_stats.document_type_breakdown)
      .map(([type, count]) => ({
        type,
        count,
      }))
      .filter((item) => item.count > 0)
      .slice(0, 6); // Top 6 document types
  }, [expiryData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalDocuments:
      expiryData.aggregated_stats?.total_documents || expiryData.count || 0,
    validDocuments: expiryData.aggregated_stats?.status_breakdown?.Valid || 0,
    expiringSoon:
      expiryData.aggregated_stats?.status_breakdown?.["Expiring Soon"] || 0,
    expired: expiryData.aggregated_stats?.status_breakdown?.Expired || 0,
    expiringIn7Days:
      expiryData.aggregated_stats?.expiry_timeline?.expiring_in_7_days || 0,
  };

  return (
    <div className="space-y-6">
      {/* Document Expiry Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Documents",
            value: stats.totalDocuments,
            description: "All tracked documents",
            color: "text-plum-900",
          },
          {
            title: "Valid Documents",
            value: stats.validDocuments,
            description: "Currently valid",
            color: "text-green-600",
          },
          {
            title: "Expiring Soon",
            value: stats.expiringSoon,
            description: "Require attention",
            color: "text-yellow-600",
          },
          {
            title: "Expired",
            value: stats.expired,
            description: "Need renewal",
            color: "text-red-600",
          },
          {
            title: "Critical (7 days)",
            value: stats.expiringIn7Days,
            description: "Urgent action needed",
            color: "text-red-800",
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Document Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Document Status Distribution
            </CardTitle>
            <CardDescription>
              Current status breakdown of all documents
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} documents (${
                      statusChartData.find((d) => d.status === name)?.percentage
                    }%)`,
                    name,
                  ]}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Type Breakdown */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Document Type Breakdown
            </CardTitle>
            <CardDescription>Distribution by document type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={documentTypeChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} documents`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  name="Documents"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Document Expiry Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Expiry Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of all employee documents with expiry dates,
            including passports, visas, contracts, and identification documents
            for compliance monitoring and renewal planning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DocumentExpiryColumns()}
              data={expiryData.results}
              pagination={true}
              dataTotalSize={expiryData.count}
              tableOptions={tableOptions}
              fallbackText="No document expiry data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentExpiryReport;
