import React from "react";
import { Database, DollarSign, UserCheck, Users, Upload } from "lucide-react";
import { Card } from "components/ui/card";
import { useNavigate } from "react-router-dom";

const EmployeeDataIntegrationLanding = () => {
  const navigate = useNavigate();

  const integrationOptions = [
    {
      id: 1,
      title: "Employee Master Sync",
      description: "Automatic synchronization with Employee Master data",
      icon: Database,
      path: "/payroll/integration/master-sync",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Salary Components Fetch",
      description: "Fetch basic salary, allowances, benefits, and deductions",
      icon: DollarSign,
      path: "/payroll/integration/salary-components",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Attendance & Leave Links",
      description: "Link with attendance, timesheet, and leave records",
      icon: UserCheck,
      path: "/payroll/integration/attendance-links",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Employee Type Support",
      description: "Support for contract and permanent employee payroll",
      icon: Users,
      path: "/payroll/integration/employee-types",
      color: "bg-orange-500",
    },
    {
      id: 5,
      title: "Bulk Upload & Mapping",
      description: "Bulk employee upload and field mapping",
      icon: Upload,
      path: "/payroll/integration/bulk-upload",
      color: "bg-indigo-500",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Data Integration</h1>
        <p className="text-gray-600 mt-2">
          Configure and manage employee data integration settings for seamless payroll processing
        </p>
      </div>

      {/* Integration Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              onClick={() => handleNavigate(option.path)}
              className="p-6 bg-white hover:shadow-lg transition-all cursor-pointer group border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${option.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                  <Icon className={`w-8 h-8 ${option.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {option.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-sm text-blue-600 font-medium group-hover:underline">
                      Configure →
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          About Employee Data Integration
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          The Employee Data Integration module ensures seamless synchronization between your HRMS
          and payroll systems. Configure automatic data syncing, map salary components, link
          attendance records, and manage different employee types - all from one centralized
          location. This ensures accurate and timely payroll processing across your organization.
        </p>
      </Card>
    </div>
  );
};

export default EmployeeDataIntegrationLanding;


