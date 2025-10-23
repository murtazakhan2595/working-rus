import React, { useState } from "react";
import { Bell, Calendar, Clock, AlertTriangle, CheckCircle, FileText, Users } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const SmartReminders = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const reminders = [
    {
      id: 1,
      type: "WPS Submission",
      title: "UAE WPS SIF File Submission",
      description: "Submit WPS SIF file for January 2025 payroll",
      deadline: "2025-01-25",
      priority: "Critical",
      status: "Pending",
      recipient: "Payroll Team",
      country: "UAE",
      frequency: "Monthly",
      lastSent: "2025-01-20",
      nextReminder: "2025-01-22",
      actionRequired: "Generate and submit WPS SIF file",
      penalty: "AED 10,000 per day delay",
    },
    {
      id: 2,
      type: "Tax Filing",
      title: "UK PAYE Tax Return",
      description: "Submit monthly PAYE tax return",
      deadline: "2025-01-31",
      priority: "High",
      status: "In Progress",
      recipient: "Finance Team",
      country: "UK",
      frequency: "Monthly",
      lastSent: "2025-01-18",
      nextReminder: "2025-01-25",
      actionRequired: "Complete PAYE tax calculations and submit",
      penalty: "GBP 100 per day delay",
    },
    {
      id: 3,
      type: "PF Contribution",
      title: "India PF Contribution Submission",
      description: "Submit PF contributions for January 2025",
      deadline: "2025-02-15",
      priority: "High",
      status: "Pending",
      recipient: "HR Team",
      country: "India",
      frequency: "Monthly",
      lastSent: "2025-01-15",
      nextReminder: "2025-02-01",
      actionRequired: "Calculate and submit PF contributions",
      penalty: "INR 1,000 per day delay",
    },
    {
      id: 4,
      type: "Social Security",
      title: "Pakistan Social Security Payment",
      description: "Submit social security payments",
      deadline: "2025-02-10",
      priority: "Medium",
      status: "Completed",
      recipient: "Payroll Team",
      country: "Pakistan",
      frequency: "Monthly",
      lastSent: "2025-01-10",
      nextReminder: "2025-02-05",
      actionRequired: "Process social security payments",
      penalty: "PKR 5,000 per day delay",
    },
  ];

  const reminderTypes = [
    {
      type: "WPS Submission",
      description: "UAE WPS SIF file submissions",
      icon: FileText,
      color: "blue",
      frequency: "Monthly",
      count: 12,
    },
    {
      type: "Tax Filing",
      description: "Tax return submissions",
      icon: Calendar,
      color: "green",
      frequency: "Monthly/Quarterly",
      count: 24,
    },
    {
      type: "PF Contribution",
      description: "Provident Fund contributions",
      icon: Users,
      color: "purple",
      frequency: "Monthly",
      count: 12,
    },
    {
      type: "Social Security",
      description: "Social security payments",
      icon: Bell,
      color: "yellow",
      frequency: "Monthly",
      count: 12,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "UAE WPS SIF Submission",
      deadline: "2025-01-25",
      daysLeft: 4,
      priority: "Critical",
      country: "UAE",
    },
    {
      id: 2,
      title: "UK PAYE Tax Return",
      deadline: "2025-01-31",
      daysLeft: 10,
      priority: "High",
      country: "UK",
    },
    {
      id: 3,
      title: "India PF Contribution",
      deadline: "2025-02-15",
      daysLeft: 25,
      priority: "High",
      country: "India",
    },
    {
      id: 4,
      title: "Pakistan Social Security",
      deadline: "2025-02-10",
      daysLeft: 20,
      priority: "Medium",
      country: "Pakistan",
    },
  ];

  const handleGenerateReminders = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDaysLeftColor = (days) => {
    if (days <= 3) return "text-red-600";
    if (days <= 7) return "text-orange-600";
    if (days <= 14) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Reminders for Statutory Submissions & WPS Deadlines</h1>
          <p className="text-gray-600 mt-1">
            AI-powered smart reminders for compliance deadlines and statutory submissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateReminders}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Generate Reminders
              </>
            )}
          </Button>
          <Button className="bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Complete
          </Button>
        </div>
      </div>

      {/* Reminder Settings */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Smart Reminder Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="reminderFrequency" className="text-sm font-medium text-gray-700">
              Reminder Frequency
            </Label>
            <select
              id="reminderFrequency"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <Label htmlFor="advanceNotice" className="text-sm font-medium text-gray-700">
              Advance Notice
            </Label>
            <select
              id="advanceNotice"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="21">21 days</option>
              <option value="30">30 days</option>
            </select>
          </div>

          <div>
            <Label htmlFor="alertMethod" className="text-sm font-medium text-gray-700">
              Alert Method
            </Label>
            <select
              id="alertMethod"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="dashboard">Dashboard</option>
              <option value="all">All Methods</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Auto-Escalation</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-gray-600">
              Escalate to managers for overdue items
            </p>
          </div>
        </div>
      </Card>

      {/* Reminder Types */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reminderTypes.map((reminder, index) => (
          <Card key={index} className={`p-6 bg-${reminder.color}-50 border-${reminder.color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <reminder.icon className={`w-6 h-6 text-${reminder.color}-600`} />
              <h3 className="font-semibold text-gray-900">{reminder.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{reminder.description}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-gray-900">{reminder.count}</span>
              <span className="text-sm text-gray-600">This year</span>
            </div>
            <p className="text-xs text-gray-500">Frequency: {reminder.frequency}</p>
          </Card>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingDeadlines.map((deadline) => (
            <div key={deadline.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{deadline.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                  {deadline.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">{deadline.deadline}</span>
                <span className={`text-sm font-semibold ${getDaysLeftColor(deadline.daysLeft)}`}>
                  ({deadline.daysLeft} days left)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {deadline.country}
                </span>
                <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                  Set Reminder
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Reminders */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Reminders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Deadline</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Recipient</th>
                <th className="p-3 text-left">Next Reminder</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => (
                <tr key={reminder.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{reminder.type}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{reminder.title}</p>
                      <p className="text-xs text-gray-500">{reminder.description}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-semibold">{reminder.deadline}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reminder.status)}`}>
                      {reminder.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{reminder.recipient}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">{reminder.nextReminder}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {reminder.status !== "Completed" && (
                        <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Complete
                        </Button>
                      )}
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reminder Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Reminders</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">48</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">42</p>
          <p className="text-sm text-gray-600 mt-1">87% completion rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">6</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting action</p>
        </Card>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-sm text-gray-600">Overdue</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">2</p>
          <p className="text-sm text-gray-600 mt-1">Critical attention</p>
        </Card>
      </div>

      {/* Smart Reminder Features */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Smart Reminder Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Automated Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Deadline tracking and monitoring</li>
              <li>• Escalation to managers for overdue items</li>
              <li>• Multi-channel notification delivery</li>
              <li>• Customizable reminder schedules</li>
              <li>• Integration with calendar systems</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Compliance Benefits</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Prevents penalty charges and fines</li>
              <li>• Ensures timely statutory submissions</li>
              <li>• Maintains regulatory compliance</li>
              <li>• Reduces manual tracking effort</li>
              <li>• Improves audit readiness</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Bell className="w-4 h-4 mr-2" />
          Generate All Reminders
        </Button>
        <Button className="bg-green-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All Complete
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Reminder History</Button>
      </div>
    </div>
  );
};

export default SmartReminders;
