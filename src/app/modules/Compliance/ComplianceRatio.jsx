import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import TableCustom from "components/CustomTable";
import { SelectInputComponent, TextInput } from "components/FormControl";
import { Building, AlertTriangle, Scale, Eye } from "lucide-react";
import { complianceRatioColumns, complianceRatioData } from "./dummyData";

const ComplianceRatio = () => {
  // Compliance Ratio filter states
  const [complianceFilters, setComplianceFilters] = useState({
    branchSearch: "",
    country: "All Countries",
    city: "All Cities",
    complianceStatus: "All Statuses",
  });

  // Handle compliance ratio filter changes
  const handleComplianceFilterChange = (filterType, value) => {
    setComplianceFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Filter compliance ratio data
  const getFilteredComplianceData = () => {
    let filtered = [...complianceRatioData];

    // Search by branch name
    if (complianceFilters.branchSearch) {
      filtered = filtered.filter((item) =>
        item.branch
          .toLowerCase()
          .includes(complianceFilters.branchSearch.toLowerCase())
      );
    }

    // Filter by country
    if (complianceFilters.country !== "All Countries") {
      filtered = filtered.filter(
        (item) => item.country === complianceFilters.country
      );
    }

    // Filter by city
    if (complianceFilters.city !== "All Cities") {
      filtered = filtered.filter(
        (item) => item.city === complianceFilters.city
      );
    }

    // Filter by compliance status
    if (complianceFilters.complianceStatus !== "All Statuses") {
      filtered = filtered.filter(
        (item) => item.status === complianceFilters.complianceStatus
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
            <div className="text-sm text-black">Total Locations (Cities)</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">7</p>
            <div className="flex items-center text-sm">
              <span className="text-black">Unique cities with branches</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Total Branches</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">8</p>
            <div className="flex items-center text-sm">
              <span className="text-black">All branches</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Non-Compliant Count</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">2</p>
            <div className="flex items-center text-sm">
              <span className="text-black">
                Branches marked as Non-Compliant
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Average Compliance %</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">92.5%</p>
            <div className="flex items-center text-sm">
              <span className="text-black">Across all branches</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Above Data Table */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <TextInput
              name="branchSearch"
              label="Search by Branch Name"
              value={complianceFilters.branchSearch}
              onChange={handleComplianceFilterChange}
              placeholder="Find a specific branch quickly"
              className="w-64"
            />
          </div>
          <div>
            <SelectInputComponent
              name="country"
              label="Country"
              value={complianceFilters.country}
              onChange={handleComplianceFilterChange}
              options={[
                { label: "All Countries", value: "All Countries" },
                { label: "UAE", value: "UAE" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="city"
              label="City"
              value={complianceFilters.city}
              onChange={handleComplianceFilterChange}
              options={[
                { label: "All Cities", value: "All Cities" },
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
              name="complianceStatus"
              label="Compliance Status"
              value={complianceFilters.complianceStatus}
              onChange={handleComplianceFilterChange}
              options={[
                { label: "All Statuses", value: "All Statuses" },
                { label: "Compliant", value: "Compliant" },
                { label: "At Risk", value: "At Risk" },
                { label: "Non-Compliant", value: "Non-Compliant" },
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

      {/* Compliance Ratio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Ratio by Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCustom
            columns={complianceRatioColumns}
            data={getFilteredComplianceData()}
            pagination={true}
            dataTotalSize={getFilteredComplianceData().length}
            tableOptions={{ page: 1, sizePerPage: 10 }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceRatio;
