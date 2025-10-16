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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getReasonAnalysisReportData } from "app/hooks/reports";
import { ReasonAnalysisColumns } from "../../TableColumns/TimeAdjustmentColumns";


const ReasonAnalysisReport = ({
  filterData = {},
  permittedViewFilterData = {},
  onFilterChange = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const [reasonData, setReasonData] = useState({
    results: [],
    period: null,
  });

  const fetchReasonData = async () => {
    setLoading(true);
    try {
      const combinedFilters = { ...filterData, ...permittedViewFilterData };
      const payload = { filterData: combinedFilters };
      const response = await getReasonAnalysisReportData(payload);
      if (response) {
        setReasonData(response);
      }
    } catch (error) {
      console.error("Error fetching reason data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (permittedViewFilterData !== null) {
      fetchReasonData();
    }
  }, [filterData, permittedViewFilterData]);

  const stats = {
    period: reasonData.period || "N/A",
    totalRecords: reasonData.results?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Period",
            value: stats.period,
            description: "Analysis period",
            color: "text-plum-900",
          },
          {
            title: "Total Reason Types",
            value: stats.totalRecords.toLocaleString(),
            description: "Different reason categories",
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

      {/* Reason Analysis Chart */}
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Top Adjustment Reasons
          </CardTitle>
          <CardDescription>
            Most frequent reasons for time adjustment requests (from API data)
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {reasonData.results.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reasonData.results.slice(0, 10)}
                margin={{ top: 20, right: 20, left: 0, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="Reason Type"
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ fontSize: "12px" }}
                  formatter={(value, name) => [`${value} requests`, "Count"]}
                />
                <Bar
                  dataKey="No. of Requests"
                  fill="#3B82F6"
                  name="Requests"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 flex items-center justify-center h-full">
              <p>No reason analysis data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reason Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reason Analysis Report</CardTitle>
          <CardDescription>
            Detailed breakdown of adjustment request reasons and their frequency
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={ReasonAnalysisColumns()}
              data={reasonData.results}
              pagination={false}
              fallbackText="No reason analysis data available"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReasonAnalysisReport;
