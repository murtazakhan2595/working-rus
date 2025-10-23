import React, { useState } from "react";
import { Users, Filter, Search, Check, X } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const EmployeeInclusion = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedAll, setSelectedAll] = useState(false);

  const employees = [
    { id: 1, name: "John Doe", emp_id: "EMP001", department: "IT", status: "Active", salary: 5000 },
    { id: 2, name: "Jane Smith", emp_id: "EMP002", department: "HR", status: "Active", salary: 4500 },
    { id: 3, name: "Mike Johnson", emp_id: "EMP003", department: "Finance", status: "Active", salary: 5500 },
    { id: 4, name: "Sarah Williams", emp_id: "EMP004", department: "IT", status: "Active", salary: 4800 },
    { id: 5, name: "Tom Brown", emp_id: "EMP005", department: "Sales", status: "On Leave", salary: 4200 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Inclusion</h1>
        <p className="text-gray-600 mt-1">
          Auto inclusion of all employees with filters and bulk actions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <p className="text-sm text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">245</p>
        </Card>
        <Card className="p-4 bg-green-50">
          <p className="text-sm text-gray-600">Included</p>
          <p className="text-2xl font-bold text-green-600">240</p>
        </Card>
        <Card className="p-4 bg-red-50">
          <p className="text-sm text-gray-600">Excluded</p>
          <p className="text-2xl font-bold text-red-600">5</p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <p className="text-sm text-gray-600">On Hold</p>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </Card>
      </div>

      {/* Filters & Bulk Actions */}
      <Card className="p-6 bg-white">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Suspended">Suspended</option>
          </select>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <Button className="bg-green-600 text-white">
              <Check className="w-4 h-4 mr-2" />
              Include All
            </Button>
            <Button className="bg-red-600 text-white">
              <X className="w-4 h-4 mr-2" />
              Exclude All
            </Button>
          </div>
        </div>
      </Card>

      {/* Employee List */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Employee List</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={(e) => setSelectedAll(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">
                  <input type="checkbox" checked={selectedAll} onChange={(e) => setSelectedAll(e.target.checked)} />
                </th>
                <th className="p-3 text-left">Emp ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Salary</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" checked={selectedAll} readOnly />
                  </td>
                  <td className="p-3 font-mono text-sm">{emp.emp_id}</td>
                  <td className="p-3 font-medium">{emp.name}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        emp.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold">${emp.salary}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        Include
                      </Button>
                      <Button className="text-xs bg-red-100 hover:bg-red-200 text-red-700">
                        Exclude
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">Continue to Computation</Button>
        <Button className="bg-gray-200 text-gray-700">Save Selection</Button>
      </div>
    </div>
  );
};

export default EmployeeInclusion;

