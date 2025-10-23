import React, { useState } from "react";
import { Shield, Users, UserCheck, Settings, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";

const RoleBasedAccess = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 1,
      name: "Payroll Admin",
      description: "Full access to all payroll functions",
      permissions: [
        "Create/Edit/Delete payroll records",
        "Process payroll runs",
        "Manage employee data",
        "Generate reports",
        "Configure system settings",
        "Manage user roles",
      ],
      users: 3,
      status: "Active",
      lastModified: "2025-01-21 10:30:00",
    },
    {
      id: 2,
      name: "Finance",
      description: "Financial reporting and approval access",
      permissions: [
        "View payroll reports",
        "Approve payroll runs",
        "Access financial data",
        "Generate cost center reports",
        "Manage budgets",
      ],
      users: 5,
      status: "Active",
      lastModified: "2025-01-21 09:15:00",
    },
    {
      id: 3,
      name: "HR",
      description: "Human resources and employee management",
      permissions: [
        "View employee data",
        "Manage employee records",
        "Access attendance data",
        "Generate HR reports",
        "Manage leave records",
      ],
      users: 8,
      status: "Active",
      lastModified: "2025-01-21 08:45:00",
    },
    {
      id: 4,
      name: "Compliance",
      description: "Compliance monitoring and reporting",
      permissions: [
        "View compliance reports",
        "Monitor statutory submissions",
        "Access audit trails",
        "Generate compliance reports",
        "Manage compliance settings",
      ],
      users: 2,
      status: "Active",
      lastModified: "2025-01-21 07:30:00",
    },
    {
      id: 5,
      name: "Employee",
      description: "Self-service access for employees",
      permissions: [
        "View own payslips",
        "Access personal data",
        "View payroll history",
        "Download payslips",
        "Update personal information",
      ],
      users: 150,
      status: "Active",
      lastModified: "2025-01-21 06:30:00",
    },
  ];

  const permissions = [
    {
      category: "Payroll Management",
      permissions: [
        { name: "Create Payroll", description: "Create new payroll records" },
        { name: "Edit Payroll", description: "Modify existing payroll data" },
        { name: "Delete Payroll", description: "Remove payroll records" },
        { name: "Process Payroll", description: "Run payroll processing" },
        { name: "Approve Payroll", description: "Approve payroll runs" },
      ],
    },
    {
      category: "Employee Data",
      permissions: [
        { name: "View Employee Data", description: "Access employee information" },
        { name: "Edit Employee Data", description: "Modify employee records" },
        { name: "Manage Employee Records", description: "Full employee management" },
        { name: "Access Personal Data", description: "View personal information" },
      ],
    },
    {
      category: "Reports & Analytics",
      permissions: [
        { name: "Generate Reports", description: "Create various reports" },
        { name: "View Financial Reports", description: "Access financial data" },
        { name: "Export Data", description: "Export reports and data" },
        { name: "Access Analytics", description: "View analytics dashboards" },
      ],
    },
    {
      category: "System Administration",
      permissions: [
        { name: "Manage Users", description: "Create and manage user accounts" },
        { name: "Manage Roles", description: "Configure role permissions" },
        { name: "System Settings", description: "Configure system parameters" },
        { name: "Audit Access", description: "View audit trails" },
      ],
    },
  ];

  const handleEditRole = (role) => {
    setSelectedRole(role);
  };

  const handleSaveRole = () => {
    setSelectedRole(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role-Based Access Control</h1>
          <p className="text-gray-600 mt-1">
            Manage user roles and permissions for payroll system access
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Role
          </Button>
          <Button className="bg-green-600 text-white">
            <UserCheck className="w-4 h-4 mr-2" />
            Assign Users
          </Button>
        </div>
      </div>

      {/* Role Management */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Roles</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Role Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Users</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Last Modified</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{role.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{role.description}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{role.users}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(role.status)}`}>
                      {role.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-gray-600">{role.lastModified}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleEditRole(role)}
                        className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button className="text-xs bg-red-100 hover:bg-red-200 text-red-700">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Permissions */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Permission Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {permissions.map((category, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">{category.category}</h3>
              <div className="space-y-2">
                {category.permissions.map((permission, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{permission.name}</p>
                      <p className="text-xs text-gray-600">{permission.description}</p>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Role Details */}
      {selectedRole && (
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Details: {selectedRole.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Role Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">{selectedRole.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold">{selectedRole.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-semibold">{selectedRole.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRole.status)}`}>
                    {selectedRole.status}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Permissions</h3>
              <div className="space-y-1">
                {selectedRole.permissions.map((permission, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSaveRole} className="bg-blue-600 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={() => setSelectedRole(null)} className="bg-gray-200 text-gray-700">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Access Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Roles</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-gray-600 mt-1">Active roles</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">168</p>
          <p className="text-sm text-gray-600 mt-1">Assigned users</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Permissions</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">24</p>
          <p className="text-sm text-gray-600 mt-1">Total permissions</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Last Updated</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">Today</p>
          <p className="text-sm text-gray-600 mt-1">Role modifications</p>
        </Card>
      </div>

      {/* Security Guidelines */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Role Management Best Practices</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Follow principle of least privilege</li>
              <li>• Regularly review and update role permissions</li>
              <li>• Implement role-based access controls</li>
              <li>• Monitor user access patterns</li>
              <li>• Maintain audit trails for all changes</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Access Control Policies</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Require strong authentication for sensitive roles</li>
              <li>• Implement session timeouts for inactive users</li>
              <li>• Use multi-factor authentication for admin roles</li>
              <li>• Regular access reviews and certifications</li>
              <li>• Immediate deactivation of terminated employees</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Role
        </Button>
        <Button className="bg-green-600 text-white">
          <UserCheck className="w-4 h-4 mr-2" />
          Manage User Assignments
        </Button>
        <Button className="bg-gray-200 text-gray-700">View Access Reports</Button>
      </div>
    </div>
  );
};

export default RoleBasedAccess;
