import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "src/@/components/ui/alert";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const HiringTrendsWidget = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Hiring Trends</CardTitle>
          <CardDescription>12-month historical analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.monthly_trends) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Hiring Trends</CardTitle>
          <CardDescription>12-month historical analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>No trend data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { monthly_trends, trend_direction, seasonality_detected } = data;

  // Format data for chart
  const chartData = monthly_trends.map((trend) => ({
    month: new Date(trend.month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    Approved: trend.approved,
    Pending: trend.pending,
    Rejected: trend.rejected,
    Total: trend.requisitions,
  }));

  // Calculate totals
  const totals = monthly_trends.reduce(
    (acc, trend) => ({
      approved: acc.approved + trend.approved,
      pending: acc.pending + trend.pending,
      rejected: acc.rejected + trend.rejected,
      total: acc.total + trend.requisitions,
    }),
    { approved: 0, pending: 0, rejected: 0, total: 0 }
  );

  // Get trend icon and color
  const getTrendDisplay = () => {
    switch (trend_direction) {
      case "increasing":
        return {
          icon: TrendingUp,
          color: "text-green-600",
          bg: "bg-green-50",
          text: "Increasing",
        };
      case "decreasing":
        return {
          icon: TrendingDown,
          color: "text-red-600",
          bg: "bg-red-50",
          text: "Decreasing",
        };
      default:
        return {
          icon: Minus,
          color: "text-neutral-600",
          bg: "bg-neutral-50",
          text: "Stable",
        };
    }
  };

  const trendDisplay = getTrendDisplay();
  const TrendIcon = trendDisplay.icon;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-plum-900">
              Hiring Trends
            </CardTitle>
            <CardDescription>12-month historical analysis</CardDescription>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendDisplay.bg}`}>
            <TrendIcon className={`h-4 w-4 ${trendDisplay.color}`} />
            <span className={`text-xs font-medium ${trendDisplay.color}`}>
              {trendDisplay.text}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-neutral-50 rounded-lg">
            <p className="text-[10px] text-neutral-700 uppercase">Total</p>
            <p className="text-lg font-bold text-neutral-900">{totals.total}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-[10px] text-green-700 uppercase">Approved</p>
            <p className="text-lg font-bold text-green-900">{totals.approved}</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <p className="text-[10px] text-yellow-700 uppercase">Pending</p>
            <p className="text-lg font-bold text-yellow-900">{totals.pending}</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-[10px] text-red-700 uppercase">Rejected</p>
            <p className="text-lg font-bold text-red-900">{totals.rejected}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="Approved"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorApproved)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Pending"
                stroke="#eab308"
                fillOpacity={1}
                fill="url(#colorPending)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Rejected"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorRejected)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Seasonality Badge */}
        {seasonality_detected && (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="text-xs">
              📊 Seasonality Pattern Detected
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HiringTrendsWidget;

