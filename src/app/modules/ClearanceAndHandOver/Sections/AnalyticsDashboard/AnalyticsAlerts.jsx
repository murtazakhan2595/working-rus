// src/app/modules/ClearanceAndHandOver/Sections/AnalyticsAlerts.jsx

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { renderDate } from "utils/renderValues";
import { Alert, AlertDescription } from "src/@/components/ui/alert";

const HighRiskAlertsPanel = ({ enhancedData }) => {
  const highRiskItems =
    enhancedData?.filter(
      (item) =>
        item.risk_level === "HIGH" &&
        (item.status === "PENDING" || item.status === "IN_PROCESS")
    ) || [];

  if (highRiskItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ High Risk Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-mauve-1000">
            <p>No high-risk clearances pending</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className=" flex items-center gap-2">
          ⚡ High Risk Alerts ({highRiskItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {highRiskItems.map((item, index) => (
            <Alert key={item.id || index} className="border-red-200">
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.employee_full_name}</div>
                    <div className="text-sm text-mauve-1000">
                      {item.department__name} • {item.clearance_type__name}
                    </div>
                    <div className="text-xs text-mauve-1000 mt-1">
                      Started: {renderDate(item.start_date)} •{" "}
                      {item.days_pending} days pending
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant="error">HIGH RISK</Badge>
                    {item.is_overdue && (
                      <Badge variant="error" className="text-xs">
                        {item.days_overdue}d OVERDUE
                      </Badge>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const EscalationQueuePanel = ({ enhancedData }) => {
  const escalationItems =
    enhancedData?.filter(
      (item) => item.is_overdue || item.sla_status === "AT_RISK"
    ) || [];

  if (escalationItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center gap-2">
            📈 Escalation Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-mauve-1000">
            <p>No items requiring escalation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className=" flex items-center gap-2">
          📈 Escalation Queue ({escalationItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {escalationItems.map((item, index) => (
            <Alert
              key={item.id || index}
              className={
                item.is_overdue ? "border-red-200" : "border-yellow-200"
              }
            >
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.employee_full_name}</div>
                    <div className="text-sm text-mauve-1000">
                      {item.department__name} • {item.clearance_type__name}
                    </div>
                    <div className="text-xs text-mauve-1000 mt-1">
                      SLA Due: {renderDate(item.sla_due_date)} •{" "}
                      {item.days_pending} days pending
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    {item.is_overdue ? (
                      <Badge variant="error">OVERDUE</Badge>
                    ) : (
                      <Badge variant="warning">AT RISK</Badge>
                    )}
                    {item.risk_level === "HIGH" && (
                      <Badge variant="error" className="text-xs">
                        HIGH RISK
                      </Badge>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsAlerts = ({ enhancedData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <HighRiskAlertsPanel enhancedData={enhancedData} />
      <EscalationQueuePanel enhancedData={enhancedData} />
    </div>
  );
};

export default AnalyticsAlerts;
