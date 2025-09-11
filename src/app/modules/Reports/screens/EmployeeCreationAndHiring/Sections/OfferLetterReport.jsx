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
import { getOfferLetterReportData } from "app/hooks/reports";
import { OfferLetterReportColumns } from "../TableColumns/HiringReportTableColumns";

const OfferLetterReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [offerData, setOfferData] = useState({
    results: [],
    count: 0,
    aggregated_stats: null,
  });
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("");

  // Chart colors
  const statusColors = ["#F59E0B", "#10B981", "#EF4444", "#6B7280"];

  // Fetch offer letter data
  const fetchOfferLetterData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = {
        filterData: combinedFilters,
        options,
        ordering,
      };

      const response = await getOfferLetterReportData(payload);
      if (response) {
        setOfferData(response);
      }
    } catch (error) {
      console.error("Error fetching offer letter data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchOfferLetterData();
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
  const offerStatusChartData = React.useMemo(() => {
    if (!offerData.aggregated_stats?.offer_status_breakdown) return [];

    return Object.entries(offerData.aggregated_stats.offer_status_breakdown)
      .map(([status, count]) => ({
        status,
        count,
        percentage:
          offerData.aggregated_stats.total_offers > 0
            ? Math.round(
                (count / offerData.aggregated_stats.total_offers) * 100
              )
            : 0,
      }))
      .filter((item) => item.count > 0);
  }, [offerData.aggregated_stats]);

  // Calculate stats from aggregated data
  const stats = {
    totalOffers:
      offerData.aggregated_stats?.total_offers || offerData.count || 0,
    pendingOffers:
      offerData.aggregated_stats?.offer_status_breakdown?.Pending || 0,
    acceptedOffers:
      offerData.aggregated_stats?.offer_status_breakdown?.Accepted || 0,
    rejectedOffers:
      offerData.aggregated_stats?.offer_status_breakdown?.Rejected || 0,
    conversionRate: offerData.aggregated_stats?.conversion_rate || 0,
  };

  return (
    <div className="space-y-6">
      {/* Offer Letter Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: "Total Offers",
            value: stats.totalOffers,
            description: "All offers issued",
            color: "text-plum-900",
          },
          {
            title: "Pending Offers",
            value: stats.pendingOffers,
            description: "Awaiting response",
            color: "text-yellow-600",
          },
          {
            title: "Accepted Offers",
            value: stats.acceptedOffers,
            description: "Successfully accepted",
            color: "text-green-600",
          },
          {
            title: "Rejected Offers",
            value: stats.rejectedOffers,
            description: "Declined offers",
            color: "text-red-600",
          },
          {
            title: "Conversion Rate",
            value: `${stats.conversionRate.toFixed(1)}%`,
            description: "Acceptance rate",
            color: "text-blue-600",
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
        {/* Offer Status Distribution */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Offer Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of all offer letters
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={offerStatusChartData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {offerStatusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} offers (${
                      offerStatusChartData.find((d) => d.status === name)
                        ?.percentage
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

        {/* Offer Performance Analysis */}
        <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-plum-900">
              Offer Performance Analysis
            </CardTitle>
            <CardDescription>
              Offer letter status breakdown and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={offerStatusChartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value) => [`${value} offers`, "Count"]}
                />
                <Bar
                  dataKey="count"
                  fill="#A78BFA"
                  name="Offers"
                  barSize={60}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Offer Letter Table */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Letter Report</CardTitle>
          <CardDescription>
            Comprehensive tracking of offer letter lifecycle including issuance
            dates, acceptance status, employee details, and conversion metrics
            for recruitment performance analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={OfferLetterReportColumns()}
              data={offerData.results}
              pagination={true}
              dataTotalSize={offerData.count}
              tableOptions={tableOptions}
              fallbackText="No offer letter data found matching the current filters"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfferLetterReport;
