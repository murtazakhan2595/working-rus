import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import TableCustom from "components/CustomTable";
import {
  SelectInputComponent,
  TextInput,
  DateRangeInput,
} from "components/FormControl";
import {
  FileText,
  CheckCircle,
  Users,
  AlertTriangle,
  Clock,
  Eye,
} from "lucide-react";
import { sopPolicyColumns, sopPolicyData } from "./dummyData";

const SopPolicy = () => {
  // SOP & Policy filter states
  const [sopFilters, setSopFilters] = useState({
    category: "All Categories",
    acknowledgmentStatus: "All",
    branch: "All Branches",
    dueDateRange: null,
    policySearch: "",
  });

  // Handle SOP & Policy filter changes
  const handleSopFilterChange = (filterType, value) => {
    setSopFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Filter SOP & Policy data
  const getFilteredSopData = () => {
    let filtered = [...sopPolicyData];

    // Search by policy name
    if (sopFilters.policySearch) {
      filtered = filtered.filter((item) =>
        item.documentName
          .toLowerCase()
          .includes(sopFilters.policySearch.toLowerCase())
      );
    }

    // Filter by category
    if (sopFilters.category !== "All Categories") {
      filtered = filtered.filter(
        (item) => item.category === sopFilters.category
      );
    }

    // Filter by acknowledgment status
    if (sopFilters.acknowledgmentStatus === "Acknowledged") {
      filtered = filtered.filter((item) => item.notAcknowledged === 0);
    } else if (sopFilters.acknowledgmentStatus === "Not Acknowledged") {
      filtered = filtered.filter((item) => item.notAcknowledged > 0);
    }

    // Filter by branch
    if (sopFilters.branch !== "All Branches") {
      filtered = filtered.filter((item) => item.branch === sopFilters.branch);
    }

    // Filter by due date range
    if (sopFilters.dueDateRange) {
      const [fromDateStr, toDateStr] = sopFilters.dueDateRange.split(",");
      if (fromDateStr && toDateStr) {
        const fromDate = new Date(fromDateStr);
        const toDate = new Date(toDateStr);
        filtered = filtered.filter((item) => {
          const dueDate = new Date(item.dueDate);
          return dueDate >= fromDate && dueDate <= toDate;
        });
      }
    }

    return filtered;
  };

  return (
    <div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Total Policies</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">8</p>
            <div className="flex items-center text-sm">
              <span className="text-black">
                Total number of policies/SOPs added
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Active Documents</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">8</p>
            <div className="flex items-center text-sm">
              <span className="text-black">Currently active or published</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Staff Acknowledged</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">93%</p>
            <div className="flex items-center text-sm">
              <span className="text-black">
                Overall acknowledgment compliance rate
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Pending Reviews</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">142</p>
            <div className="flex items-center text-sm">
              <span className="text-black">
                Policies with incomplete acknowledgment
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-black">Due This Month</div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">2</p>
            <div className="flex items-center text-sm">
              <span className="text-black">
                Policies reaching acknowledgment deadline
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <TextInput
              name="policySearch"
              label="Policy Name / Search"
              value={sopFilters.policySearch}
              onChange={handleSopFilterChange}
              placeholder="Search policies..."
              className="w-64"
            />
          </div>
          <div>
            <SelectInputComponent
              name="category"
              label="Category"
              value={sopFilters.category}
              onChange={handleSopFilterChange}
              options={[
                { label: "All Categories", value: "All Categories" },
                { label: "HR", value: "HR" },
                { label: "IT", value: "IT" },
                { label: "Safety", value: "Safety" },
                { label: "Finance", value: "Finance" },
                { label: "Operations", value: "Operations" },
                { label: "Quality", value: "Quality" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="acknowledgmentStatus"
              label="Acknowledgment Status"
              value={sopFilters.acknowledgmentStatus}
              onChange={handleSopFilterChange}
              options={[
                { label: "All", value: "All" },
                { label: "Acknowledged", value: "Acknowledged" },
                { label: "Not Acknowledged", value: "Not Acknowledged" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="branch"
              label="Branch"
              value={sopFilters.branch}
              onChange={handleSopFilterChange}
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
            <label className="block text-sm font-medium text-black-700 mb-1">
              Due Date Range
            </label>
            <DateRangeInput
              name="dueDateRange"
              value={sopFilters.dueDateRange}
              onChange={(field, value) =>
                handleSopFilterChange("dueDateRange", value)
              }
              placeholder="Select date range"
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

      {/* SOP & Policy Table */}
      <Card>
        <CardHeader>
          <CardTitle>SOP & Policy Acknowledgment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCustom
            columns={sopPolicyColumns}
            data={getFilteredSopData()}
            pagination={true}
            dataTotalSize={getFilteredSopData().length}
            tableOptions={{ page: 1, sizePerPage: 10 }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SopPolicy;
