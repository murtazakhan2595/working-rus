import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const OfferTrackerWidget = ({ data, loading }) => {
  const navigate = useNavigate();

  // Colors for offer statuses
  const COLORS = {
    Draft: "#94A3B8", // Gray
    "Pending Approval": "#F59E0B", // Orange
    "Sent to Applicant": "#3B82F6", // Blue
    Accepted: "#10B981", // Green
    Rejected: "#EF4444", // Red
    Withdrawn: "#6B7280", // Dark Gray
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data
      .filter((item) => item.count > 0) // Only show statuses with count > 0
      .map((item) => ({
        name: item.status,
        value: item.count,
        color: COLORS[item.status] || "#94A3B8",
      }));
  }, [data]);

  // Calculate totals
  const totalOffers = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 border border-neutral-300 rounded shadow-lg">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-xs text-neutral-700">Count: {data.value}</p>
          <p className="text-xs text-neutral-700">
            {((data.value / totalOffers) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const handleViewAll = () => {
    navigate("/talent-sphere/offer-tracking");
  };

  if (loading) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Offer Tracker
          </CardTitle>
          <CardDescription>Offer status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-plum-900">
              Offer Tracker
            </CardTitle>
            <CardDescription>
              {totalOffers} total offers across all stages
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!chartData || chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-neutral-500">
            No offer data available
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Status Summary Cards */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {data?.map((status, index) => (
                <div
                  key={index}
                  className="p-2 bg-neutral-100 rounded text-center"
                >
                  <p className="text-xs text-neutral-1000 truncate">
                    {status.status}
                  </p>
                  <p className="text-lg font-semibold text-plum-900">
                    {status.count}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OfferTrackerWidget;
