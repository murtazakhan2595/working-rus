import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Badge } from "components/ui/badge";
import { TrendingUp, Users, UserCheck, Briefcase } from "lucide-react";

const EmiratizationWidget = ({ data, loading }) => {
  // Map API data to metrics
  const metrics = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const metricIcons = {
      "Total Emiratization Roles": <Briefcase className="h-5 w-5" />,
      "Applicants for Emiratization Roles": <Users className="h-5 w-5" />,
      "Shortlisted Emirati Applicants": <UserCheck className="h-5 w-5" />,
      "Hired Emirati Applicants": <TrendingUp className="h-5 w-5" />,
    };

    const metricColors = {
      "Total Emiratization Roles": "text-blue-600",
      "Applicants for Emiratization Roles": "text-purple-600",
      "Shortlisted Emirati Applicants": "text-orange-600",
      "Hired Emirati Applicants": "text-green-600",
    };

    return data.map((item) => ({
      title: item.metric,
      value: item.count,
      icon: metricIcons[item.metric] || <Users className="h-5 w-5" />,
      color: metricColors[item.metric] || "text-plum-900",
    }));
  }, [data]);

  // Calculate conversion rate
  const conversionRate = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;

    const applicants =
      data.find((m) => m.metric === "Applicants for Emiratization Roles")
        ?.count || 0;
    const hired =
      data.find((m) => m.metric === "Hired Emirati Applicants")?.count || 0;

    return applicants > 0 ? ((hired / applicants) * 100).toFixed(1) : 0;
  }, [data]);

  if (loading) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Emiratization Insights
          </CardTitle>
          <CardDescription>Emirati talent recruitment tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
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
              Emiratization Insights
            </CardTitle>
            <CardDescription>
              Emirati talent recruitment tracking
            </CardDescription>
          </div>
          {conversionRate > 0 && (
            <Badge variant="secondary" className="text-xs">
              {conversionRate}% Conversion
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!metrics || metrics.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            No emiratization data available
          </div>
        ) : (
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-4 bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${metric.color}`}>{metric.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {metric.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmiratizationWidget;
