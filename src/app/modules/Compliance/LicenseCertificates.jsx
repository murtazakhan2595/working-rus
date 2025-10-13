import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import TableCustom from "components/CustomTable";
import { SelectInputComponent, TextInput } from "components/FormControl";
import {
  Users,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Eye,
} from "lucide-react";
import { employeeLicensesColumns, employeeLicensesData } from "./dummyData";

const LicenseCertificates = () => {
  // Filter states
  const [licenseCertificatesFilters, setLicenseCertificatesFilters] = useState({
    search: "",
    branch: "All Branches",
    designation: "All Designations",
    type: "All Types",
  });

  // Handle License & Certificates filter changes
  const handleLicenseCertificatesFilterChange = (filterType, value) => {
    setLicenseCertificatesFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Filter License & Certificates data
  const getFilteredLicenseCertificatesData = () => {
    let filtered = [...employeeLicensesData];

    if (licenseCertificatesFilters.branch !== "All Branches") {
      filtered = filtered.filter(
        (license) => license.branch === licenseCertificatesFilters.branch
      );
    }

    if (licenseCertificatesFilters.designation !== "All Designations") {
      filtered = filtered.filter(
        (license) =>
          license.designation === licenseCertificatesFilters.designation
      );
    }

    if (licenseCertificatesFilters.type !== "All Types") {
      filtered = filtered.filter(
        (license) => license.type === licenseCertificatesFilters.type
      );
    }

    if (licenseCertificatesFilters.search) {
      const searchLower = licenseCertificatesFilters.search.toLowerCase();
      filtered = filtered.filter(
        (license) =>
          license.employeeName.toLowerCase().includes(searchLower) ||
          license.employeeId.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  return (
    <div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">Total Employees</h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">245</p>
            <div className="flex items-center text-sm">
              <span className="text-gray-700">with licenses/certificates</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">
              Expiring within 60 Days
            </h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">18</p>
            <div className="flex items-center text-sm">
              <span className="text-orange-500 font-medium">
                Require attention
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">
              Renewal in Progress
            </h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">12</p>
            <div className="flex items-center text-sm">
              <span className="text-blue-500 font-medium">
                Applications submitted
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">Compliance Ratio</h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">94%</p>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium mr-1">↑ 2%</span>
              <span className="text-gray-700">from last quarter</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <TextInput
              name="search"
              label="Search by Employee Name / ID"
              value={licenseCertificatesFilters.search}
              onChange={handleLicenseCertificatesFilterChange}
              placeholder="Search employee..."
              className="w-64"
            />
          </div>
          <div>
            <SelectInputComponent
              name="branch"
              label="Branch"
              value={licenseCertificatesFilters.branch}
              onChange={handleLicenseCertificatesFilterChange}
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
                { label: "Al Ain Pharmacy", value: "Al Ain Pharmacy" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="designation"
              label="Designation"
              value={licenseCertificatesFilters.designation}
              onChange={handleLicenseCertificatesFilterChange}
              options={[
                { label: "All Designations", value: "All Designations" },
                { label: "Pharmacist", value: "Pharmacist" },
                {
                  label: "Pharmacy Technician",
                  value: "Pharmacy Technician",
                },
                { label: "Manager", value: "Manager" },
                { label: "Supervisor", value: "Supervisor" },
                { label: "Cashier", value: "Cashier" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="type"
              label="Type"
              value={licenseCertificatesFilters.type}
              onChange={handleLicenseCertificatesFilterChange}
              options={[
                { label: "All Types", value: "All Types" },
                { label: "License", value: "License" },
                { label: "Certificate", value: "Certificate" },
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

      {/* Employee Licenses & Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Licenses & Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCustom
            columns={employeeLicensesColumns}
            data={getFilteredLicenseCertificatesData()}
            pagination={true}
            dataTotalSize={getFilteredLicenseCertificatesData().length}
            tableOptions={{ page: 1, sizePerPage: 10 }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseCertificates;
