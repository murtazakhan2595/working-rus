import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearAIAlerts } from "state/slices/GlobalPayrollSlice";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  X,
  Sparkles
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { ScrollArea } from "components/ui/scroll-area";
import { Badge } from "components/ui/badge";

const AIAlertWidget = ({ className = "", maxHeight = "400px" }) => {
  const dispatch = useDispatch();
  const { aiAlerts, aiRecommendations, anomalies } = useSelector(
    (state) => state.globalPayroll
  );

  const allAlerts = [
    ...aiAlerts.map((a) => ({ ...a, category: "alert" })),
    ...aiRecommendations.map((r) => ({ ...r, category: "recommendation" })),
    ...anomalies.map((an) => ({ ...an, category: "anomaly" })),
  ];

  const handleClearAll = () => {
    dispatch(clearAIAlerts());
  };

  const getIcon = (severity) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "medium":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "info":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "border-purple-500 bg-purple-50 dark:bg-purple-900/20";
    }
  };

  if (allAlerts.length === 0) {
    return (
      <div className={`${className} p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col items-center justify-center gap-3 text-center py-8">
          <Sparkles className="w-12 h-12 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            All Clear!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No AI alerts or recommendations at this time. Your payroll is running smoothly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI Insights & Alerts
          </h3>
          <Badge variant="secondary" className="ml-2">
            {allAlerts.length}
          </Badge>
        </div>
        {allAlerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Alerts List */}
      <ScrollArea style={{ maxHeight }} className="p-4">
        <div className="space-y-3">
          {allAlerts.map((alert, index) => (
            <Alert
              key={index}
              className={`${getSeverityColor(alert.severity)} border-l-4`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getIcon(alert.severity)}
                    <AlertTitle className="text-sm font-semibold mb-0">
                      {alert.title || alert.type?.replace(/_/g, " ").toUpperCase()}
                    </AlertTitle>
                    {alert.category && (
                      <Badge variant="outline" className="text-xs">
                        {alert.category}
                      </Badge>
                    )}
                  </div>
                  <AlertDescription className="text-sm mt-2">
                    {alert.message || alert.description}
                  </AlertDescription>
                  
                  {/* Additional details */}
                  {alert.employeeId && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      Employee ID: <span className="font-mono">{alert.employeeId}</span>
                    </div>
                  )}
                  
                  {alert.suggestion && (
                    <div className="mt-2 p-2 bg-white/50 dark:bg-gray-900/50 rounded text-sm">
                      <span className="font-semibold">Suggestion:</span> {alert.suggestion}
                    </div>
                  )}
                </div>
                
                {/* Severity Badge */}
                <Badge 
                  variant={alert.severity === "high" ? "destructive" : "secondary"}
                  className="shrink-0"
                >
                  {alert.severity || "info"}
                </Badge>
              </div>
            </Alert>
          ))}
        </div>
      </ScrollArea>

      {/* Footer with stats */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>
            {anomalies.length} Anomalies · {aiRecommendations.length} Recommendations
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-Powered Insights
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIAlertWidget;

