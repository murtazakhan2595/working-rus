import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "state/slices/GlobalPayrollSlice";
import { FileText, User, Calendar, Filter } from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Badge } from "components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const PayrollAuditLogs = () => {
  const dispatch = useDispatch();
  const { auditLogs } = useSelector((state) => state.globalPayroll);
  
  const [actionFilter, setActionFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAuditLogs({ limit: 50 }));
  }, [dispatch]);

  // Mock audit logs
  const mockLogs = [
    {
      id: 1,
      action: "Created",
      resource: "Payroll Run",
      resource_id: "PR-2024-12",
      user: "John Admin",
      user_email: "john@company.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      details: "Created payroll run for December 2024",
      ip_address: "192.168.1.1",
    },
    {
      id: 2,
      action: "Approved",
      resource: "Payroll Run",
      resource_id: "PR-2024-12",
      user: "Sarah Manager",
      user_email: "sarah@company.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      details: "Approved payroll run for December 2024",
      ip_address: "192.168.1.2",
    },
    {
      id: 3,
      action: "Updated",
      resource: "Salary Component",
      resource_id: "HRA",
      user: "Ahmed HR",
      user_email: "ahmed@company.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      details: "Updated Housing Allowance percentage to 30%",
      ip_address: "192.168.1.3",
    },
    {
      id: 4,
      action: "Generated",
      resource: "WPS File",
      resource_id: "WPS-2024-12",
      user: "System",
      user_email: "system@company.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
      details: "Generated WPS file for December 2024",
      ip_address: "System",
    },
  ];

  const displayLogs = auditLogs.length > 0 ? auditLogs : mockLogs;

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case "created":
        return "bg-blue-500";
      case "updated":
        return "bg-yellow-500";
      case "deleted":
        return "bg-red-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "generated":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Payroll Audit Logs & Compliance
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complete audit trail of all payroll activities
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="font-semibold">{log.resource}</span>
                      <span className="text-sm text-gray-500">#{log.resource_id}</span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{log.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                      </div>
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollAuditLogs;

