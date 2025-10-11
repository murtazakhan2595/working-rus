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
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  Briefcase,
} from "lucide-react";

const HiringPredictionWidget = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Hiring Predictions
          </CardTitle>
          <CardDescription>Next 6 months forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Hiring Predictions
          </CardTitle>
          <CardDescription>Next 6 months forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>No prediction data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const {
    forecast_period,
    historical_analysis,
    predictions,
    department_breakdown,
    recommendations,
  } = data;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-plum-900">
          Hiring Predictions
        </CardTitle>
        <CardDescription>
          {forecast_period?.months}-month forecast (
          {new Date(forecast_period?.start_date).toLocaleDateString()} -{" "}
          {new Date(forecast_period?.end_date).toLocaleDateString()})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">
                Predicted Hires
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {predictions?.predicted_hires || 0}
            </p>
            <p className="text-[10px] text-blue-700 mt-1">
              out of {predictions?.predicted_requisitions || 0} requisitions
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-900">
                Est. Budget
              </span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              ${((predictions?.estimated_budget_needed || 0) / 1000).toFixed(0)}K
            </p>
            <Badge
              variant="outline"
              className="mt-1 text-[9px] bg-white text-green-700"
            >
              {predictions?.confidence_level || "N/A"} confidence
            </Badge>
          </div>
        </div>

        {/* Historical Context */}
        <div className="bg-neutral-50 p-3 rounded-lg">
          <h4 className="text-xs font-semibold text-neutral-1000 mb-2">
            Historical Analysis
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-neutral-700">Approval Rate</p>
              <p className="font-bold text-neutral-1000">
                {historical_analysis?.approval_rate?.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-neutral-700">Fill Rate</p>
              <p className="font-bold text-neutral-1000">
                {historical_analysis?.fill_rate?.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-neutral-700">Avg. Time</p>
              <p className="font-bold text-neutral-1000">
                {historical_analysis?.average_time_to_hire_days || 0} days
              </p>
            </div>
          </div>
        </div>

        {/* Top Departments */}
        <div>
          <h4 className="text-xs font-semibold text-neutral-1000 mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Top Hiring Departments
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {department_breakdown
              ?.filter((dept) => dept.predicted_requisitions > 0)
              ?.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-1000">
                      {dept.department_name}
                    </p>
                    <p className="text-[10px] text-neutral-700">
                      {dept.predicted_requisitions} predicted positions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-plum-900">
                      ${(dept.recommended_budget_allocation / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[9px] text-neutral-700">budget</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-neutral-1000 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Recommendations
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <Alert
                  key={index}
                  variant={rec.priority === "high" ? "destructive" : "default"}
                  className="py-2"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <AlertDescription className="text-[11px]">
                    <span className="font-semibold capitalize">{rec.type}:</span>{" "}
                    {rec.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HiringPredictionWidget;

