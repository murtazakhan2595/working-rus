import React, { useState } from "react";
import { Calendar, Clock, UserCheck, Link2, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const AttendanceLinksSettings = () => {
  const [linkSettings, setLinkSettings] = useState({
    attendanceEnabled: true,
    timesheetEnabled: true,
    leaveEnabled: true,
    overtimeEnabled: true,
    autoCalculateWorkingDays: true,
    considerHalfDays: true,
    considerLateArrivals: false,
    deductForAbsences: true,
    payForOvertime: true,
  });

  const [dataLinks, setDataLinks] = useState([
    {
      id: 1,
      type: "Attendance",
      source: "Attendance Module",
      linkField: "attendance_records",
      status: "connected",
      lastSync: "2025-01-21 10:30:00",
      recordsLinked: 5245,
    },
    {
      id: 2,
      type: "Timesheet",
      source: "Project Timesheet",
      linkField: "timesheet_hours",
      status: "connected",
      lastSync: "2025-01-21 10:25:00",
      recordsLinked: 3890,
    },
    {
      id: 3,
      type: "Leave Records",
      source: "Leave Management",
      linkField: "leave_applications",
      status: "connected",
      lastSync: "2025-01-21 10:20:00",
      recordsLinked: 1256,
    },
    {
      id: 4,
      type: "Overtime",
      source: "Attendance Module",
      linkField: "overtime_hours",
      status: "connected",
      lastSync: "2025-01-21 10:30:00",
      recordsLinked: 456,
    },
  ]);

  const [calculationRules, setCalculationRules] = useState([
    {
      id: 1,
      rule: "Full Day Absent",
      action: "Deduct 1 day salary",
      enabled: true,
    },
    {
      id: 2,
      rule: "Half Day Absent",
      action: "Deduct 0.5 day salary",
      enabled: true,
    },
    {
      id: 3,
      rule: "Late Arrival (>30 min)",
      action: "Deduct 0.25 day salary",
      enabled: false,
    },
    {
      id: 4,
      rule: "Overtime (per hour)",
      action: "Add 1.5x hourly rate",
      enabled: true,
    },
    {
      id: 5,
      rule: "Weekend Overtime",
      action: "Add 2x hourly rate",
      enabled: true,
    },
    {
      id: 6,
      rule: "Unpaid Leave",
      action: "Deduct per day salary",
      enabled: true,
    },
  ]);

  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState({
    rule: "",
    action: "",
    enabled: true,
  });

  const handleSettingChange = (key, value) => {
    setLinkSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleLink = (id) => {
    setDataLinks(
      dataLinks.map((link) =>
        link.id === id
          ? {
              ...link,
              status: link.status === "connected" ? "disconnected" : "connected",
            }
          : link
      )
    );
  };

  const handleToggleRule = (id) => {
    setCalculationRules(
      calculationRules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handleAddRule = () => {
    if (newRule.rule && newRule.action) {
      setCalculationRules([
        ...calculationRules,
        {
          ...newRule,
          id: Date.now(),
        },
      ]);
      setNewRule({
        rule: "",
        action: "",
        enabled: true,
      });
      setIsAddingRule(false);
    }
  };

  const getStatusIcon = (status) => {
    return status === "connected" ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getLinkIcon = (type) => {
    if (type === "Attendance") return <UserCheck className="w-5 h-5 text-blue-600" />;
    if (type === "Timesheet") return <Clock className="w-5 h-5 text-purple-600" />;
    if (type === "Leave Records") return <Calendar className="w-5 h-5 text-orange-600" />;
    return <Clock className="w-5 h-5 text-green-600" />;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance & Leave Links</h1>
          <p className="text-gray-600 mt-1">
            Link with attendance, timesheet, and leave records for payroll calculation
          </p>
        </div>
        <Button
          onClick={() => setIsAddingRule(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add Calculation Rule
        </Button>
      </div>

      {/* Link Configuration */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Link Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Link Attendance</Label>
              <p className="text-xs text-gray-600 mt-1">Connect attendance data</p>
            </div>
            <Switch
              checked={linkSettings.attendanceEnabled}
              onCheckedChange={(checked) => handleSettingChange("attendanceEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Link Timesheet</Label>
              <p className="text-xs text-gray-600 mt-1">Connect timesheet hours</p>
            </div>
            <Switch
              checked={linkSettings.timesheetEnabled}
              onCheckedChange={(checked) => handleSettingChange("timesheetEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Link Leave Records</Label>
              <p className="text-xs text-gray-600 mt-1">Connect leave applications</p>
            </div>
            <Switch
              checked={linkSettings.leaveEnabled}
              onCheckedChange={(checked) => handleSettingChange("leaveEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Link Overtime</Label>
              <p className="text-xs text-gray-600 mt-1">Connect overtime hours</p>
            </div>
            <Switch
              checked={linkSettings.overtimeEnabled}
              onCheckedChange={(checked) => handleSettingChange("overtimeEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Auto Calculate Days</Label>
              <p className="text-xs text-gray-600 mt-1">Auto working days</p>
            </div>
            <Switch
              checked={linkSettings.autoCalculateWorkingDays}
              onCheckedChange={(checked) =>
                handleSettingChange("autoCalculateWorkingDays", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Consider Half Days</Label>
              <p className="text-xs text-gray-600 mt-1">Include half day leaves</p>
            </div>
            <Switch
              checked={linkSettings.considerHalfDays}
              onCheckedChange={(checked) => handleSettingChange("considerHalfDays", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Late Arrivals</Label>
              <p className="text-xs text-gray-600 mt-1">Deduct for late arrivals</p>
            </div>
            <Switch
              checked={linkSettings.considerLateArrivals}
              onCheckedChange={(checked) =>
                handleSettingChange("considerLateArrivals", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Deduct Absences</Label>
              <p className="text-xs text-gray-600 mt-1">Deduct for absences</p>
            </div>
            <Switch
              checked={linkSettings.deductForAbsences}
              onCheckedChange={(checked) => handleSettingChange("deductForAbsences", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium text-gray-900">Pay Overtime</Label>
              <p className="text-xs text-gray-600 mt-1">Include overtime pay</p>
            </div>
            <Switch
              checked={linkSettings.payForOvertime}
              onCheckedChange={(checked) => handleSettingChange("payForOvertime", checked)}
            />
          </div>
        </div>
      </Card>

      {/* Active Data Links */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Data Links</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataLinks.map((link) => (
            <Card
              key={link.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getLinkIcon(link.type)}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{link.type}</h4>
                    <p className="text-xs text-gray-600">{link.source}</p>
                  </div>
                </div>
                {getStatusIcon(link.status)}
              </div>

              <div className="space-y-2">
                <div className="text-xs">
                  <span className="text-gray-600">Link Field:</span>
                  <span className="ml-2 font-mono font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded">
                    {link.linkField}
                  </span>
                </div>

                <div className="text-xs text-gray-600">Last Sync: {link.lastSync}</div>

                <div className="text-xs font-medium text-gray-900">
                  Records Linked: {link.recordsLinked.toLocaleString()}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.status === "connected"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {link.status === "connected" ? "Connected" : "Disconnected"}
                  </span>
                  <Button
                    onClick={() => handleToggleLink(link.id)}
                    className={`text-xs px-3 py-1 ${
                      link.status === "connected"
                        ? "bg-red-100 hover:bg-red-200 text-red-700"
                        : "bg-green-100 hover:bg-green-200 text-green-700"
                    }`}
                  >
                    {link.status === "connected" ? "Disconnect" : "Reconnect"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Calculation Rules */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Calculation Rules</h3>
        </div>

        <div className="space-y-3">
          {calculationRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{rule.rule}</h4>
                <p className="text-xs text-gray-600 mt-1">{rule.action}</p>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => handleToggleRule(rule.id)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Add Rule Modal */}
      {isAddingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Calculation Rule</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="rule" className="text-sm font-medium text-gray-700">
                  Rule Condition
                </Label>
                <input
                  id="rule"
                  type="text"
                  value={newRule.rule}
                  onChange={(e) => setNewRule({ ...newRule, rule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Early Departure"
                />
              </div>

              <div>
                <Label htmlFor="action" className="text-sm font-medium text-gray-700">
                  Action
                </Label>
                <input
                  id="action"
                  type="text"
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Deduct 0.25 day salary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsAddingRule(false);
                  setNewRule({
                    rule: "",
                    action: "",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddRule}
                disabled={!newRule.rule || !newRule.action}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
              >
                Add Rule
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceLinksSettings;

