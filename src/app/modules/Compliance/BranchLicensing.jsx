import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import TableCustom from "components/CustomTable";
import { Badge } from "components/ui/badge";
import { DateRangeInput, SelectInputComponent } from "components/FormControl";
import {
  Building,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { facilityLicensesData } from "./dummyData";

const BranchLicensing = ({
  isAddLicenseModalOpen,
  setIsAddLicenseModalOpen,
  isViewLicenseModalOpen,
  setIsViewLicenseModalOpen,
  isEditLicenseModalOpen,
  setIsEditLicenseModalOpen,
  isDeleteLicenseModalOpen,
  setIsDeleteLicenseModalOpen,
  selectedLicense,
  setSelectedLicense,
  handleAddLicense,
  handleEditLicense,
  handleDeleteLicense,
  handleProceedForRenewal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("branch-license");

  // Filter states
  const [filters, setFilters] = useState({
    branch: "All Branches",
    licenseType: "All Types",
    status: "All Statuses",
    expiryDateRange: null, // Will be string format "YYYY-MM-DD,YYYY-MM-DD"
  });

  // License data state
  const [facilityLicenses, setFacilityLicenses] = useState([]);

  // Initialize facility licenses data
  useEffect(() => {
    setFacilityLicenses(facilityLicensesData);
  }, []);

  // Auto-update license statuses based on expiry dates
  useEffect(() => {
    const updateLicenseStatuses = () => {
      const today = new Date();
      setFacilityLicenses((prevLicenses) =>
        prevLicenses.map((license) => {
          const expiryDate = new Date(license.expiryDate);
          const daysUntilExpiry = Math.ceil(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
          );

          let newStatus = license.status;
          let renewalIntimations = license.renewalIntimations || 0;

          // Update status based on expiry logic
          if (daysUntilExpiry <= 0) {
            newStatus = "Expired";
          } else if (daysUntilExpiry <= 30) {
            if (license.status === "Expiring Soon" && renewalIntimations >= 1) {
              // Move to renewal tracking on second intimation
              newStatus = "Renewal Tracking";
              renewalIntimations = 2;
            } else if (license.status !== "Renewal Tracking") {
              newStatus = "Expiring Soon";
              renewalIntimations = renewalIntimations + 1;
            }
          } else if (
            daysUntilExpiry > 30 &&
            license.status !== "Renewal Tracking"
          ) {
            newStatus = "Active";
          }

          return {
            ...license,
            status: newStatus,
            daysUntilExpiry,
            renewalIntimations,
          };
        })
      );
    };

    // Update statuses immediately
    updateLicenseStatuses();

    // Update statuses daily
    const interval = setInterval(updateLicenseStatuses, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Filter functions
  const getFilteredLicenses = () => {
    let filtered = [...facilityLicenses];

    if (filters.branch !== "All Branches") {
      filtered = filtered.filter(
        (license) => license.facilityName === filters.branch
      );
    }

    if (filters.licenseType !== "All Types") {
      filtered = filtered.filter(
        (license) => license.licenseType === filters.licenseType
      );
    }

    if (filters.status !== "All Statuses") {
      filtered = filtered.filter(
        (license) => license.status === filters.status
      );
    }

    if (filters.expiryDateRange) {
      const [fromDateStr, toDateStr] = filters.expiryDateRange.split(",");
      if (fromDateStr && toDateStr) {
        const fromDate = new Date(fromDateStr);
        const toDate = new Date(toDateStr);
        filtered = filtered.filter((license) => {
          const expiryDate = new Date(license.expiryDate);
          return expiryDate >= fromDate && expiryDate <= toDate;
        });
      }
    }

    return filtered;
  };

  // Get unique values for filter dropdowns
  const getUniqueBranches = () => {
    const branches = facilityLicenses.map((license) => license.facilityName);
    return [...new Set(branches)].sort();
  };

  const getUniqueLicenseTypes = () => {
    const types = facilityLicenses.map((license) => license.licenseType);
    return [...new Set(types)].sort();
  };

  const getUniqueStatuses = () => {
    const statuses = facilityLicenses.map((license) => license.status);
    return [...new Set(statuses)].sort();
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleDateRangeChange = (field, dateRangeString) => {
    setFilters((prev) => ({
      ...prev,
      expiryDateRange: dateRangeString,
    }));
  };

  // Calculate dashboard metrics
  const getDashboardMetrics = () => {
    const totalFacilities = facilityLicenses.length;
    const expiringSoon = facilityLicenses.filter(
      (license) => license.status === "Expiring Soon"
    ).length;
    const renewalInProgress = facilityLicenses.filter(
      (license) => license.status === "Renewal Tracking"
    ).length;
    const activeLicenses = facilityLicenses.filter(
      (license) => license.status === "Active"
    ).length;
    const complianceRate =
      totalFacilities > 0
        ? Math.round(
            ((activeLicenses + renewalInProgress) / totalFacilities) * 100
          )
        : 0;

    return {
      totalFacilities,
      expiringSoon,
      renewalInProgress,
      complianceRate,
    };
  };

  const facilityLicensesColumns = [
    {
      dataField: "facilityName",
      text: "Branch *",
      formatter: (cell, row) => (
        <div className="flex items-center">
          <span className="font-medium">{row.facilityName}</span>
        </div>
      ),
    },
    {
      dataField: "licenseNumber",
      text: "License No *",
    },
    {
      dataField: "licenseType",
      text: "License Type *",
    },
    {
      dataField: "issuingAuthority",
      text: "Issuing Authority",
    },
    {
      dataField: "issueDate",
      text: "Issue Date *",
    },
    {
      dataField: "expiryDate",
      text: "Expiry Date *",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge
          variant={
            row.status === "Active"
              ? "success"
              : row.status === "Expiring Soon"
              ? "warning"
              : row.status === "Renewal Tracking"
              ? "secondary"
              : "destructive"
          }
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLicense(row);
              setIsViewLicenseModalOpen(true);
            }}
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLicense(row);
              setIsEditLicenseModalOpen(true);
            }}
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLicense(row);
              setIsDeleteLicenseModalOpen(true);
            }}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {(row.status === "Expiring Soon" || row.status === "Active") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleProceedForRenewal(row)}
              title="Proceed for Renewal"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Sub Tabs */}
      <Tabs
        value={activeSubTab}
        onValueChange={setActiveSubTab}
        className="mb-6"
      >
        <TabsList className="grid-cols-3">
          <TabsTrigger value="branch-license" className="text-black">
            Branch License
          </TabsTrigger>
          <TabsTrigger value="renewal-tracking" className="text-black">
            Renewal Tracking
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {(() => {
            const metrics = getDashboardMetrics();
            return (
              <>
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-black">Total Branches</div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-black">
                      {metrics.totalFacilities}
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        ↑ {Math.floor(metrics.totalFacilities * 0.05)}
                      </span>
                      <span className="text-black">from last year</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-black">Licenses Expiring</div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-black">
                      {metrics.expiringSoon}
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="text-black">Within 60 days</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-black">
                      Renewal In Progress
                    </div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-black">
                      {metrics.renewalInProgress}
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="text-black">Applications submitted</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-black">Compliance Rate</div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-black">
                      {metrics.complianceRate}%
                    </p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        ↑ {Math.floor(metrics.complianceRate * 0.02)}%
                      </span>
                      <span className="text-black">from last quarter</span>
                    </div>
                  </div>
                </Card>
              </>
            );
          })()}
        </div>

        {/* Filters and Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <SelectInputComponent
                name="branch"
                label="Branch Name"
                value={filters.branch}
                onChange={handleFilterChange}
                options={[
                  { label: "All Branches", value: "All Branches" },
                  ...getUniqueBranches().map((branch) => ({
                    label: branch,
                    value: branch,
                  })),
                ]}
                className="w-48"
              />
            </div>
            <div>
              <SelectInputComponent
                name="licenseType"
                label="License Type"
                value={filters.licenseType}
                onChange={handleFilterChange}
                options={[
                  { label: "All Types", value: "All Types" },
                  ...getUniqueLicenseTypes().map((type) => ({
                    label: type,
                    value: type,
                  })),
                ]}
                className="w-48"
              />
            </div>
            <div>
              <SelectInputComponent
                name="status"
                label="Status"
                value={filters.status}
                onChange={handleFilterChange}
                options={[
                  { label: "All Statuses", value: "All Statuses" },
                  ...getUniqueStatuses().map((status) => ({
                    label: status,
                    value: status,
                  })),
                ]}
                className="w-48"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black-700 mb-1">
                Expiry Date Range
              </label>
              <DateRangeInput
                name="expiryDateRange"
                value={filters.expiryDateRange}
                onChange={handleDateRangeChange}
                placeholder="Select date range"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="successOutline" className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              className="flex items-center"
              onClick={() => setIsAddLicenseModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add License
            </Button>
          </div>
        </div>

        {/* Sub Tab Content */}
        <TabsContent value="branch-license">
          <Card>
            <CardHeader>
              <CardTitle>Branch Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={facilityLicensesColumns}
                data={getFilteredLicenses()}
                pagination={true}
                dataTotalSize={getFilteredLicenses().length}
                tableOptions={{ page: 1, sizePerPage: 10 }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="renewal-tracking">
          <Card>
            <CardHeader>
              <CardTitle>Renewal Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={facilityLicensesColumns}
                data={getFilteredLicenses().filter(
                  (item) => item.status === "Renewal Tracking"
                )}
                pagination={true}
                dataTotalSize={
                  getFilteredLicenses().filter(
                    (item) => item.status === "Renewal Tracking"
                  ).length
                }
                tableOptions={{ page: 1, sizePerPage: 10 }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BranchLicensing;
