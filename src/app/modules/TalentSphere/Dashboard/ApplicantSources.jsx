import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";

const ApplicantSources = ({ data, loading }) => {
  const navigate = useNavigate();
  
  // Colors for different sources
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

  // Map API source names to filter values
  const mapSourceToFilterValue = (source) => {
    const sourceMap = {
      "LinkedIn": "linkedin",
      "Indeed": "indeed",
      "Cohrus Careers Portal": "cohrus",
      "Employee Referrals": "other",
      "Other Social Platforms": "other",
    };
    return sourceMap[source] || source.toLowerCase();
  };

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count) // Sort by count descending
      .map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length],
      }));
  }, [data]);

  // Calculate total applicants
  const totalApplicants = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage =
        totalApplicants > 0
          ? ((data.count / totalApplicants) * 100).toFixed(1)
          : 0;

      return (
        <div className="bg-white p-3 border border-neutral-300 rounded-lg shadow-lg">
          <p className="font-semibold text-sm">{data.source}</p>
          <p className="text-xs text-neutral-700">Applicants: {data.count}</p>
          <p className="text-xs text-neutral-700">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Top Applicant Sources
          </CardTitle>
          <CardDescription>Where applicants are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-80">
            <div className="h-full bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-plum-900">
          Top Applicant Sources
        </CardTitle>
        <CardDescription>
          {totalApplicants} total applicants from {chartData.length} sources
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {!chartData || chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500">
            No source data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <XAxis
                dataKey="source"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                onClick={(data) => {
                  const filterValue = mapSourceToFilterValue(data.source);
                  navigate(`/talent-sphere/applicant-management?source=${filterValue}`);
                }}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicantSources;
