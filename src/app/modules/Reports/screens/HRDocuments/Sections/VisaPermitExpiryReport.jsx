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
import { getVisaPermitExpiryData } from "app/hooks/reports";
import { VisaPermitExpiryColumns } from "../TableColumns/HRDocumentTableColumns";

const VisaPermitExpiryReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [visaData, setVisaData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#10B981", "#F59E0B", "#EF4444", "#6B7280"];
  const countryColors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

  // Fetch visa permit data
  const fetchVisaData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getVisaPermitExpiryData(payload);
      if (response) {
        setVisaData(response);
      }
    } catch (error) {
      console.error("Error fetching visa permit data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchVisaData();
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
    if (!visaData.aggregated_stats?.status_breakdown) return [];

    return Object.entries(visaData.aggregated_stats.status_breakdown)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          visaData.aggregated_stats.total_visas > 0
            ? Math.round((count / visaData.aggregated_stats.total_visas) * 100)
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [visaData.aggregated_stats]);

  // Country chart data
  const countryChartData = React.useMemo(() => {
    if (!visaData.aggregated_stats?.country_breakdown) return [];

    return Object.entries(visaData.aggregated_stats.country_breakdown)
      .map(([country, count]) => ({
        country,
        count,
      }))
      .filter((item) => item.count > 0);
  }, [visaData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalVisas: visaData.aggregated_stats?.total_visas || visaData.count || 0,
    expiringSoon:
      visaData.aggregated_stats?.status_breakdown?.["Expiring Soon"] || 0,
    expired: visaData.aggregated_stats?.status_breakdown?.Expired || 0,
    unknown: visaData.aggregated_stats?.status_breakdown?.Unknown || 0,
    expiringIn30Days:
      visaData.aggregated_stats?.expiry_timeline?.expiring_in_30_days || 0,
  };

  return (
    <div className="space-y-6">
      {/* Visa & Work Permit Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Visas",
            value: stats.totalVisas,
            description: "All tracked visas",
            color: "text-plum-900",
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
            title: "Unknown Status",
            value: stats.unknown,
            description: "Require verification",
            color: "text-gray-600",
          },
          {
            title: "Critical (30 days)",
            value: stats.expiringIn30Days,
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
        {/* Visa Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Visa Status Distribution
            </CardTitle>
            <CardDescription>
              Current status breakdown of all visas and work permits
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
                    `${value} visas (${
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

        {/* Country-wise Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Country-wise Distribution
            </CardTitle>
            <CardDescription>
              Visa and work permit distribution by country
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={countryChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} visas`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  name="Visas"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Visa & Work Permit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visa & Work Permit Expiry Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of employee visas and work permits with
            expiry monitoring for UAE/KSA compliance, including employment
            visas, work permits, and other immigration documents critical for
            legal employment status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={VisaPermitExpiryColumns()}
              data={visaData.results}
              pagination={true}
              dataTotalSize={visaData.count}
              tableOptions={tableOptions}
              fallbackText="No visa permit data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisaPermitExpiryReport;
