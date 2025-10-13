import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import TableCustom from "components/CustomTable";
import {
  SelectInputComponent,
  TextInput,
  DateRangeInput,
} from "components/FormControl";
import {
  Scale,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Eye,
} from "lucide-react";
import {
  workforceRegulationsColumns,
  workforceRegulationsData,
  workingHoursColumns,
  workingHoursData,
  employeeContractsColumns,
  employeeContractsData,
} from "./dummyData";

const WorkforceRegulations = () => {
  const [activeWorkforceSubTab, setActiveWorkforceSubTab] =
    useState("labor-law");

  // Workforce Regulations filter states
  const [workforceFilters, setWorkforceFilters] = useState({
    complianceStatus: "All Statuses",
    regulationArea: "",
    branch: "All Branches",
    categoryType: "All Categories",
  });

  // Working Hours filter states
  const [workingHoursFilters, setWorkingHoursFilters] = useState({
    region: "All Regions",
    status: "All Statuses",
    branch: "",
    dateRange: null,
    department: "All Departments",
  });

  // Employee Contracts filter states
  const [contractFilters, setContractFilters] = useState({
    branch: "All Branches",
    status: "All Statuses",
    search: "",
  });

  // Handle Workforce Regulations filter changes
  const handleWorkforceFilterChange = (filterType, value) => {
    setWorkforceFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle Working Hours filter changes
  const handleWorkingHoursFilterChange = (filterType, value) => {
    setWorkingHoursFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle Employee Contracts filter changes
  const handleContractFilterChange = (filterType, value) => {
    setContractFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Filter Workforce Regulations data
  const getFilteredWorkforceData = () => {
    let filtered = [...workforceRegulationsData];

    // Search by regulation area
    if (workforceFilters.regulationArea) {
      filtered = filtered.filter((item) =>
        item.regulationArea
          .toLowerCase()
          .includes(workforceFilters.regulationArea.toLowerCase())
      );
    }

    // Filter by compliance status
    if (workforceFilters.complianceStatus !== "All Statuses") {
      filtered = filtered.filter(
        (item) => item.status === workforceFilters.complianceStatus
      );
    }

    // Filter by branch
    if (workforceFilters.branch !== "All Branches") {
      filtered = filtered.filter((item) =>
        item.branchCompliant.includes(workforceFilters.branch)
      );
    }

    // Filter by category type
    if (workforceFilters.categoryType !== "All Categories") {
      filtered = filtered.filter(
        (item) => item.categoryType === workforceFilters.categoryType
      );
    }

    return filtered;
  };

  // Filter Working Hours data
  const getFilteredWorkingHoursData = () => {
    let filtered = [...workingHoursData];

    // Search by branch name
    if (workingHoursFilters.branch) {
      filtered = filtered.filter((item) =>
        item.branchName
          .toLowerCase()
          .includes(workingHoursFilters.branch.toLowerCase())
      );
    }

    // Filter by region
    if (workingHoursFilters.region !== "All Regions") {
      filtered = filtered.filter(
        (item) => item.region === workingHoursFilters.region
      );
    }

    // Filter by status
    if (workingHoursFilters.status !== "All Statuses") {
      filtered = filtered.filter(
        (item) => item.status === workingHoursFilters.status
      );
    }

    // Filter by department (optional - using totalStaff as proxy for department size)
    if (workingHoursFilters.department !== "All Departments") {
      // This is a placeholder filter - in real implementation, you'd filter by actual department
      filtered = filtered.filter((item) => item.totalStaff > 30); // Example: filter by staff size
    }

    // Filter by date range (placeholder - in real implementation, you'd filter by actual date ranges)
    if (workingHoursFilters.dateRange) {
      // This would filter by actual date ranges in a real implementation
      // For now, we'll just return the filtered data as is
    }

    return filtered;
  };

  // Filter Employee Contracts data
  const getFilteredContractData = () => {
    let filtered = [...employeeContractsData];

    // Search by employee name or ID
    if (contractFilters.search) {
      filtered = filtered.filter(
        (item) =>
          item.employeeName
            .toLowerCase()
            .includes(contractFilters.search.toLowerCase()) ||
          item.employeeId
            .toLowerCase()
            .includes(contractFilters.search.toLowerCase())
      );
    }

    // Filter by branch
    if (contractFilters.branch !== "All Branches") {
      filtered = filtered.filter(
        (item) => item.branch === contractFilters.branch
      );
    }

    // Filter by status
    if (contractFilters.status !== "All Statuses") {
      filtered = filtered.filter(
        (item) => item.status === contractFilters.status
      );
    }

    return filtered;
  };

  return (
    <div>
      {/* Sub Tabs */}
      <Tabs
        value={activeWorkforceSubTab}
        onValueChange={setActiveWorkforceSubTab}
        className="mb-6"
      >
        <TabsList className="grid-cols-3">
          <TabsTrigger value="labor-law" className="text-black">
            UAE Labor Law
          </TabsTrigger>
          <TabsTrigger value="working-hours" className="text-black">
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="employment-contracts" className="text-black">
            Employment Contracts
          </TabsTrigger>
        </TabsList>

        {/* Sub Tab Content */}
        <TabsContent value="labor-law">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">
                  Total Regulations Tracked
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">25</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Total number of UAE Labour Law regulations monitored
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Fully Compliant Areas</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">18</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Number of regulation areas marked as "Compliant"
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">At Risk Areas</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">5</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Regulation areas nearing non-compliance
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Non-Compliant Areas</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">2</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Number of areas currently failing compliance
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Last Verification Date</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">28 Jan</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Date of last successful full compliance audit
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <SelectInputComponent
                  name="complianceStatus"
                  label="Compliance Status"
                  value={workforceFilters.complianceStatus}
                  onChange={handleWorkforceFilterChange}
                  options={[
                    { label: "All Statuses", value: "All Statuses" },
                    { label: "Compliant", value: "Compliant" },
                    { label: "At Risk", value: "At Risk" },
                    { label: "Non-Compliant", value: "Non-Compliant" },
                  ]}
                  className="w-48"
                />
              </div>
              <div>
                <TextInput
                  name="regulationArea"
                  label="Regulation Area"
                  value={workforceFilters.regulationArea}
                  onChange={handleWorkforceFilterChange}
                  placeholder="Search or filter by specific Labor law areas"
                  className="w-64"
                />
              </div>
              <div>
                <SelectInputComponent
                  name="branch"
                  label="Branch"
                  value={workforceFilters.branch}
                  onChange={handleWorkforceFilterChange}
                  options={[
                    { label: "All Branches", value: "All Branches" },
                    {
                      label: "Dubai Mall Pharmacy",
                      value: "Dubai Mall Pharmacy",
                    },
                    {
                      label: "Abu Dhabi Marina Pharmacy",
                      value: "Abu Dhabi Marina Pharmacy",
                    },
                    {
                      label: "Sharjah City Center Pharmacy",
                      value: "Sharjah City Center Pharmacy",
                    },
                    {
                      label: "Dubai Healthcare City Pharmacy",
                      value: "Dubai Healthcare City Pharmacy",
                    },
                    {
                      label: "Al Ain Pharmacy",
                      value: "Al Ain Pharmacy",
                    },
                  ]}
                  className="w-48"
                />
              </div>
              <div>
                <SelectInputComponent
                  name="categoryType"
                  label="Category Type"
                  value={workforceFilters.categoryType}
                  onChange={handleWorkforceFilterChange}
                  options={[
                    { label: "All Categories", value: "All Categories" },
                    { label: "Leave", value: "Leave" },
                    { label: "Working Hours", value: "Working Hours" },
                    { label: "End of Service", value: "End of Service" },
                    { label: "Wages", value: "Wages" },
                    { label: "Employment", value: "Employment" },
                  ]}
                  className="w-48"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="successOutline" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* UAE Labor Law Compliance Table */}
          <Card>
            <CardHeader>
              <CardTitle>UAE Labor Law Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={workforceRegulationsColumns}
                data={getFilteredWorkforceData()}
                pagination={true}
                dataTotalSize={getFilteredWorkforceData().length}
                tableOptions={{ page: 1, sizePerPage: 10 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working-hours">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Total Employees</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">293</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Total number of active employees included in attendance
                    tracking
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Under Contract</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">293</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Total number of employees under valid employment contracts
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Compliance Rate</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">75%</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    % of branches within legal working hours
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">
                  Average Working Hours (hrs/week)
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">46.8</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Organization-wide average weekly hours
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Labor Law Compliance</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">75% Compliant</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">High-level summary</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Recommended Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">
                  Total Overtime Hours (This Month)
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">1,247</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Sum of all overtime hours logged across branches
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Branches At Risk</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">3</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Count of branches nearing or exceeding the legal limit
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Last Audit Date</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">25 Jan</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Date when working hour data was last reviewed or verified
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <SelectInputComponent
                  name="region"
                  label="Region"
                  value={workingHoursFilters.region}
                  onChange={handleWorkingHoursFilterChange}
                  options={[
                    { label: "All Regions", value: "All Regions" },
                    { label: "Dubai", value: "Dubai" },
                    { label: "Abu Dhabi", value: "Abu Dhabi" },
                    { label: "Sharjah", value: "Sharjah" },
                    { label: "Al Ain", value: "Al Ain" },
                    { label: "Fujairah", value: "Fujairah" },
                    { label: "Ajman", value: "Ajman" },
                    { label: "Ras Al Khaimah", value: "Ras Al Khaimah" },
                  ]}
                  className="w-48"
                />
              </div>
              <div>
                <SelectInputComponent
                  name="status"
                  label="Status"
                  value={workingHoursFilters.status}
                  onChange={handleWorkingHoursFilterChange}
                  options={[
                    { label: "All Statuses", value: "All Statuses" },
                    { label: "Compliant", value: "Compliant" },
                    { label: "At Risk", value: "At Risk" },
                    { label: "Non-Compliant", value: "Non-Compliant" },
                  ]}
                  className="w-48"
                />
              </div>
              <div>
                <TextInput
                  name="branch"
                  label="Branch"
                  value={workingHoursFilters.branch}
                  onChange={handleWorkingHoursFilterChange}
                  placeholder="Search for a specific branch"
                  className="w-64"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black-700 mb-1">
                  Date Range / Period
                </label>
                <DateRangeInput
                  name="dateRange"
                  value={workingHoursFilters.dateRange}
                  onChange={(field, value) =>
                    handleWorkingHoursFilterChange("dateRange", value)
                  }
                  placeholder="Filter by time period (week/month)"
                />
              </div>
              <div>
                <SelectInputComponent
                  name="department"
                  label="Department (optional)"
                  value={workingHoursFilters.department}
                  onChange={handleWorkingHoursFilterChange}
                  options={[
                    {
                      label: "All Departments",
                      value: "All Departments",
                    },
                    {
                      label: "Large Departments (30+ staff)",
                      value: "Large Departments",
                    },
                    {
                      label: "Small Departments (<30 staff)",
                      value: "Small Departments",
                    },
                  ]}
                  className="w-48"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="successOutline" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Working Hours Compliance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Working Hours Compliance by Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={workingHoursColumns}
                data={getFilteredWorkingHoursData()}
                pagination={true}
                dataTotalSize={getFilteredWorkingHoursData().length}
                tableOptions={{ page: 1, sizePerPage: 10 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment-contracts">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Total Employees</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">293</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Total employees having contract records
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Active Contracts</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">245</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Count of currently valid employee contracts
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Expiring Soon</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">24</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Count of contracts nearing expiration (e.g., within 30 days)
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Expired Contracts</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">24</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Count of contracts that have passed their end date
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-black">Compliance Rate</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-black">84%</p>
                <div className="flex items-center text-sm">
                  <span className="text-black">
                    Percentage of employees with valid active contracts =
                    (Active Contracts / Total Employees) × 100
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <SelectInputComponent
                  name="branch"
                  label="Branch"
                  value={contractFilters.branch}
                  onChange={handleContractFilterChange}
                  options={[
                    { label: "All Branches", value: "All Branches" },
                    {
                      label: "Dubai Mall Pharmacy",
                      value: "Dubai Mall Pharmacy",
                    },
                    {
                      label: "Abu Dhabi Marina Pharmacy",
                      value: "Abu Dhabi Marina Pharmacy",
                    },
                    {
                      label: "Dubai Healthcare City Pharmacy",
                      value: "Dubai Healthcare City Pharmacy",
                    },
                    {
                      label: "Sharjah City Center Pharmacy",
                      value: "Sharjah City Center Pharmacy",
                    },
                    {
                      label: "Al Ain Pharmacy",
                      value: "Al Ain Pharmacy",
                    },
                    {
                      label: "Fujairah Pharmacy",
                      value: "Fujairah Pharmacy",
                    },
                    { label: "Ajman Pharmacy", value: "Ajman Pharmacy" },
                  ]}
                  className="w-48"
                />
              </div>
              <div>
                <SelectInputComponent
                  name="status"
                  label="Status"
                  value={contractFilters.status}
                  onChange={handleContractFilterChange}
                  options={[
                    { label: "All Statuses", value: "All Statuses" },
                    { label: "Active", value: "Active" },
                    { label: "Expiring Soon", value: "Expiring Soon" },
                    { label: "Expired", value: "Expired" },
                    { label: "Not Available", value: "Not Available" },
                  ]}
                  className="w-48"
                />
              </div>
              <div>
                <TextInput
                  name="search"
                  label="Search by Employee Name/ID"
                  value={contractFilters.search}
                  onChange={handleContractFilterChange}
                  placeholder="Search by employee name or ID"
                  className="w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="successOutline" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Employee Contracts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={employeeContractsColumns}
                data={getFilteredContractData()}
                pagination={true}
                dataTotalSize={getFilteredContractData().length}
                tableOptions={{ page: 1, sizePerPage: 10 }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkforceRegulations;
