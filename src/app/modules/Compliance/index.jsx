import React, { useState, useEffect } from "react";
import { Header } from "components";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import TableCustom from "components/CustomTable";
import BarChart from "components/BarChart";
import { Badge } from "components/ui/badge";
import {
  AddLicenseModal,
  ViewLicenseModal,
  EditLicenseModal,
  DeleteLicenseModal,
} from "components/Compliance";
import { DateRangeInput } from "components/FormControl";
import {
  Building,
  Scale,
  GraduationCap,
  FileText,
  Users,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  complianceChartData,
  complianceRatioColumns,
  complianceRatioData,
  complianceStats,
  employeeContractsColumns,
  employeeContractsData,
  employeeLicensesColumns,
  employeeLicensesData,
  facilityLicensesData,
  mandatoryTrainingColumns,
  mandatoryTrainingData,
  sopPolicyColumns,
  sopPolicyData,
  stats,
  workforceRegulationsColumns,
  workforceRegulationsData,
  workingHoursColumns,
  workingHoursData,
} from "./dummyData";

const Compliance = () => {
  const [activeTab, setActiveTab] = useState("facility");
  const [activeSubTab, setActiveSubTab] = useState("branch-license");
  const [activeWorkforceSubTab, setActiveWorkforceSubTab] =
    useState("labor-law");
  const [vs2, setVs2] = useState(false);

  // Modal states
  const [isAddLicenseModalOpen, setIsAddLicenseModalOpen] = useState(false);
  const [isViewLicenseModalOpen, setIsViewLicenseModalOpen] = useState(false);
  const [isEditLicenseModalOpen, setIsEditLicenseModalOpen] = useState(false);
  const [isDeleteLicenseModalOpen, setIsDeleteLicenseModalOpen] =
    useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    branch: "All Branches",
    licenseType: "All Types",
    status: "All Statuses",
    expiryDateRange: null, // Will be string format "YYYY-MM-DD,YYYY-MM-DD"
  });

  // Compliance Ratio filter states
  const [complianceFilters, setComplianceFilters] = useState({
    branchSearch: "",
    country: "All Countries",
    city: "All Cities",
    complianceStatus: "All Statuses",
  });

  // Mandatory Training filter states
  const [trainingFilters, setTrainingFilters] = useState({
    branch: "All Branches",
    department: "All Departments",
    trainingProgram: "All Programs",
    frequency: "All Frequencies",
    status: "All Statuses",
  });

  // SOP & Policy filter states
  const [sopFilters, setSopFilters] = useState({
    category: "All Categories",
    acknowledgmentStatus: "All",
    branch: "All Branches",
    dueDateRange: null,
    policySearch: "",
  });

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

  const [licenseCertificatesFilters, setLicenseCertificatesFilters] = useState({
    search: "",
    branch: "All Branches",
    designation: "All Designations",
    type: "All Types",
  });

  // License data state
  const [facilityLicenses, setFacilityLicenses] = useState([]);

  console.log(vs2, "vs2");
  // Check for v2 parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const v2Param = urlParams.get("v2");
    setVs2(v2Param === "true");
  }, []);

  // Initialize facility licenses data
  useEffect(() => {
    setFacilityLicenses(facilityLicensesData);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Notification system for expiring licenses
  useEffect(() => {
    const checkExpiringLicenses = () => {
      const expiringLicenses = facilityLicenses.filter(
        (license) =>
          license.status === "Expiring Soon" ||
          license.status === "Renewal Tracking"
      );

      if (expiringLicenses.length > 0) {
        // Show browser notification if permission is granted
        if (Notification.permission === "granted") {
          expiringLicenses.forEach((license) => {
            new Notification(`License Expiring Soon`, {
              body: `${license.facilityName} - ${license.licenseNumber} expires in ${license.daysUntilExpiry} days`,
              icon: "/favicon.ico",
            });
          });
        } else if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    };

    // Check for expiring licenses every hour
    const notificationInterval = setInterval(
      checkExpiringLicenses,
      60 * 60 * 1000
    );

    // Check immediately
    checkExpiringLicenses();

    return () => clearInterval(notificationInterval);
  }, [facilityLicenses]);

  // Handler functions for license operations
  const handleAddLicense = (newLicense) => {
    console.log("handleAddLicense called with:", newLicense);
    setFacilityLicenses((prev) => {
      const updated = [...prev, newLicense];
      console.log("Updated facilityLicenses:", updated);
      return updated;
    });
    updateDashboardCards();
  };

  const handleEditLicense = (updatedLicense) => {
    setFacilityLicenses((prev) =>
      prev.map((license) =>
        license.id === updatedLicense.id ? updatedLicense : license
      )
    );
    updateDashboardCards();
  };

  const handleDeleteLicense = (licenseToDelete) => {
    setFacilityLicenses((prev) =>
      prev.filter((license) => license.id !== licenseToDelete.id)
    );
    updateDashboardCards();
  };

  const handleProceedForRenewal = (license) => {
    // Move license to renewal tracking tab
    const updatedLicense = {
      ...license,
      status: "Renewal Tracking",
      renewalInitiatedAt: new Date().toISOString(),
      renewalIntimations: 2, // Mark as second intimation
    };
    handleEditLicense(updatedLicense);
  };

  const updateDashboardCards = () => {
    // This function will be called to update dashboard cards
    // The cards will automatically update based on the facilityLicenses state
  };

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

  // Handle compliance ratio filter changes
  const handleComplianceFilterChange = (filterType, value) => {
    setComplianceFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle mandatory training filter changes
  const handleTrainingFilterChange = (filterType, value) => {
    setTrainingFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle SOP & Policy filter changes
  const handleSopFilterChange = (filterType, value) => {
    setSopFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

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

  // Handle License & Certificates filter changes
  const handleLicenseCertificatesFilterChange = (filterType, value) => {
    setLicenseCertificatesFilters((prev) => ({
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

  // Filter mandatory training data
  const getFilteredTrainingData = () => {
    let filtered = [...mandatoryTrainingData];

    // Filter by branch
    if (trainingFilters.branch !== "All Branches") {
      filtered = filtered.filter(
        (item) => item.branch === trainingFilters.branch
      );
    }

    // Filter by department (using designation as department)
    if (trainingFilters.department !== "All Departments") {
      filtered = filtered.filter(
        (item) => item.designation === trainingFilters.department
      );
    }

    // Filter by training program
    if (trainingFilters.trainingProgram !== "All Programs") {
      filtered = filtered.filter(
        (item) => item.trainingProgramName === trainingFilters.trainingProgram
      );
    }

    // Filter by frequency
    if (trainingFilters.frequency !== "All Frequencies") {
      filtered = filtered.filter(
        (item) => item.frequency === trainingFilters.frequency
      );
    }

    // Filter by status
    if (trainingFilters.status !== "All Statuses") {
      filtered = filtered.filter(
        (item) => item.status === trainingFilters.status
      );
    }

    return filtered;
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
    <div className="flex flex-col">
      <Header />

      <div className="p-4">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="grid grid-cols-7 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`border-slate-200 hover:shadow-lg transition-shadow${
                  activeTab === stat.id && vs2
                    ? "border border-primary-900 hover:cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (vs2) setActiveTab(stat.id);
                }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div
                    className={`text-sm mb-1 
                    ${
                      activeTab === stat.id && vs2
                        ? "text-plum-900"
                        : "text-black"
                    }
                    `}
                  >
                    {vs2 ? stat.fullName : stat.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-2xl font-semibold  ${
                        activeTab === stat.id && vs2
                          ? "text-plum-900"
                          : "text-black"
                      }`}
                    >
                      {stat.value}
                    </div>
                    {stat.warning && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!vs2 && (
            <TabsList className="bg-transparent">
              {complianceStats.map((stat) => {
                return (
                  <TabsTrigger
                    value={stat.id}
                    className="data-[state=active]:bg-transparent text-black"
                    variant="inner-tab"
                  >
                    {stat.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}

          {/* Compliance Overview Cards */}
          {/* {vs2 && (
          <div className="grid grid-cols-7 gap-4 mb-6 mt-6">
            {complianceStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={stat.id}
                  className={`p-3 hover:shadow-md transition-shadow ${
                    activeTab === stat.id && vs2
                      ? "border border-primary-900 hover:cursor-pointer"
                      : ""
                  }`}
                  onClick={() => {
                    if (vs2) setActiveTab(stat.id);
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        activeTab === stat.id && vs2
                          ? "bg-plum-50 text-plum-900"
                          : ""
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <p
                      className={`text-sm font-semibold mb-1 ${
                        activeTab === stat.id && vs2 ? "text-plum-900" : ""
                      }`}
                    >
                      {stat.title}
                    </p>
                    <div className="flex items-center">
                      <span
                        className={`text-xs font-bold mr-1 ${
                          activeTab === stat.id && vs2 ? "text-plum-900" : ""
                        }`}
                      >
                        {stat.percentage}%
                      </span>
                      {getStatusIcon(stat.status)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          )} */}

          {/* Facility Licensing Tab */}
          <TabsContent value="facility">
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
                          <h3 className="text-sm font-medium text-black">
                            Total Facilities
                          </h3>
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
                            <span className="text-gray-700">
                              from last year
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-black">
                            Licenses Expiring
                          </h3>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-black">
                            {metrics.expiringSoon}
                          </p>
                          <div className="flex items-center text-sm">
                            <span className="text-yellow-500 font-medium">
                              Within 60 days
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-black">
                            Renewal In Progress
                          </h3>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 text-blue-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-black">
                            {metrics.renewalInProgress}
                          </p>
                          <div className="flex items-center text-sm">
                            <span className="text-blue-500 font-medium">
                              Applications submitted
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-black">
                            Compliance Rate
                          </h3>
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
                            <span className="text-gray-700">
                              from last quarter
                            </span>
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
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Branch Name
                    </label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.branch}
                      onChange={(e) =>
                        handleFilterChange("branch", e.target.value)
                      }
                    >
                      <option value="All Branches">All Branches</option>
                      {getUniqueBranches().map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      License Type
                    </label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.licenseType}
                      onChange={(e) =>
                        handleFilterChange("licenseType", e.target.value)
                      }
                    >
                      <option value="All Types">All Types</option>
                      {getUniqueLicenseTypes().map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Status
                    </label>
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="All Statuses">All Statuses</option>
                      {getUniqueStatuses().map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
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
                  <Button
                    variant="successOutline"
                    className="flex items-center"
                  >
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

            {/* Charts Section */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart
                    categories={complianceChartData.categories}
                    series={complianceChartData.series}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>License Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-green-600">98%</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Active Licenses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* License & Certificates Tab */}
          <TabsContent value="license-certificates">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Total Employees
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">245</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">
                      with licenses/certificates
                    </span>
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
                  <h3 className="text-sm font-medium text-black">
                    Compliance Ratio
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">94%</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 font-medium mr-1">
                      ↑ 2%
                    </span>
                    <span className="text-gray-700">from last quarter</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Search by Employee Name / ID
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-64"
                    placeholder="Search employee..."
                    value={licenseCertificatesFilters.search}
                    onChange={(e) =>
                      handleLicenseCertificatesFilterChange(
                        "search",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Branch
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={licenseCertificatesFilters.branch}
                    onChange={(e) =>
                      handleLicenseCertificatesFilterChange(
                        "branch",
                        e.target.value
                      )
                    }
                  >
                    <option>All Branches</option>
                    <option>Dubai Mall Pharmacy</option>
                    <option>Abu Dhabi Marina Pharmacy</option>
                    <option>Sharjah City Center Pharmacy</option>
                    <option>Dubai Healthcare City Pharmacy</option>
                    <option>Al Ain Pharmacy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Designation
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={licenseCertificatesFilters.designation}
                    onChange={(e) =>
                      handleLicenseCertificatesFilterChange(
                        "designation",
                        e.target.value
                      )
                    }
                  >
                    <option>All Designations</option>
                    <option>Pharmacist</option>
                    <option>Pharmacy Technician</option>
                    <option>Manager</option>
                    <option>Supervisor</option>
                    <option>Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Type
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={licenseCertificatesFilters.type}
                    onChange={(e) =>
                      handleLicenseCertificatesFilterChange(
                        "type",
                        e.target.value
                      )
                    }
                  >
                    <option>All Types</option>
                    <option>License</option>
                    <option>Certificate</option>
                  </select>
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
          </TabsContent>

          {/* Mandatory Training Tab */}
          <TabsContent value="training">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-5 gap-6 mb-8">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Total Assigned Trainings
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">8</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">
                      All mandatory trainings assigned
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Completed Trainings
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">3</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 font-medium">
                      Successfully completed
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    In Progress Trainings
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">3</p>
                  <div className="flex items-center text-sm">
                    <span className="text-blue-500 font-medium">
                      Currently being completed
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Pending / Overdue Trainings
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">2</p>
                  <div className="flex items-center text-sm">
                    <span className="text-orange-500 font-medium">
                      Due or not started
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Compliance %
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">37.5%</p>
                  <div className="flex items-center text-sm">
                    <span className="text-purple-500 font-medium">
                      Training completion rate
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Branch
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={trainingFilters.branch}
                    onChange={(e) =>
                      handleTrainingFilterChange("branch", e.target.value)
                    }
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Dubai Mall Pharmacy">
                      Dubai Mall Pharmacy
                    </option>
                    <option value="Abu Dhabi Marina Pharmacy">
                      Abu Dhabi Marina Pharmacy
                    </option>
                    <option value="Sharjah City Center Pharmacy">
                      Sharjah City Center Pharmacy
                    </option>
                    <option value="Dubai Healthcare City Pharmacy">
                      Dubai Healthcare City Pharmacy
                    </option>
                    <option value="Al Ain Pharmacy">Al Ain Pharmacy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Department
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={trainingFilters.department}
                    onChange={(e) =>
                      handleTrainingFilterChange("department", e.target.value)
                    }
                  >
                    <option value="All Departments">All Departments</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Pharmacy Technician">
                      Pharmacy Technician
                    </option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Cashier">Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Training Program
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={trainingFilters.trainingProgram}
                    onChange={(e) =>
                      handleTrainingFilterChange(
                        "trainingProgram",
                        e.target.value
                      )
                    }
                  >
                    <option value="All Programs">All Programs</option>
                    <option value="UAE Labor Law Compliance">
                      UAE Labor Law Compliance
                    </option>
                    <option value="Workplace Safety & Health">
                      Workplace Safety & Health
                    </option>
                    <option value="UAE Pharmacy Regulations">
                      UAE Pharmacy Regulations
                    </option>
                    <option value="Fire Safety & Emergency Response">
                      Fire Safety & Emergency Response
                    </option>
                    <option value="Data Privacy & GDPR Compliance">
                      Data Privacy & GDPR Compliance
                    </option>
                    <option value="Patient Counseling Excellence">
                      Patient Counseling Excellence
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Frequency
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={trainingFilters.frequency}
                    onChange={(e) =>
                      handleTrainingFilterChange("frequency", e.target.value)
                    }
                  >
                    <option value="All Frequencies">All Frequencies</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Status
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={trainingFilters.status}
                    onChange={(e) =>
                      handleTrainingFilterChange("status", e.target.value)
                    }
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="successOutline" className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Mandatory Training Table */}
            <Card>
              <CardHeader>
                <CardTitle>Mandatory Training Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <TableCustom
                  columns={mandatoryTrainingColumns}
                  data={getFilteredTrainingData()}
                  pagination={true}
                  dataTotalSize={getFilteredTrainingData().length}
                  tableOptions={{ page: 1, sizePerPage: 10 }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Ratio Tab */}
          <TabsContent value="ratio">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Total Locations (Cities)
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">7</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">
                      Unique cities with branches
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Total Branches
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">8</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">All branches</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Non-Compliant Count
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">2</p>
                  <div className="flex items-center text-sm">
                    <span className="text-red-500 font-medium mr-1">
                      Branches marked as Non-Compliant
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Average Compliance %
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">92.5%</p>
                  <div className="flex items-center text-sm">
                    <span className="text-orange-500 font-medium mr-1">
                      Across all branches
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters Above Data Table */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Search by Branch Name
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-64"
                    placeholder="Find a specific branch quickly"
                    value={complianceFilters.branchSearch}
                    onChange={(e) =>
                      handleComplianceFilterChange(
                        "branchSearch",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Country
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={complianceFilters.country}
                    onChange={(e) =>
                      handleComplianceFilterChange("country", e.target.value)
                    }
                  >
                    <option value="All Countries">All Countries</option>
                    <option value="UAE">UAE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    City
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={complianceFilters.city}
                    onChange={(e) =>
                      handleComplianceFilterChange("city", e.target.value)
                    }
                  >
                    <option value="All Cities">All Cities</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Al Ain">Al Ain</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Compliance Status
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={complianceFilters.complianceStatus}
                    onChange={(e) =>
                      handleComplianceFilterChange(
                        "complianceStatus",
                        e.target.value
                      )
                    }
                  >
                    <option value="All Statuses">All Statuses</option>
                    <option value="Compliant">Compliant</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                  </select>
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
          </TabsContent>

          {/* SOP & Policy Tab */}
          <TabsContent value="sop">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-5 gap-6 mb-8">
              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Total Policies
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">8</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-700">
                      Total number of policies/SOPs added
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Active Documents
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">8</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 font-medium">
                      Currently active or published
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Staff Acknowledged
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">93%</p>
                  <div className="flex items-center text-sm">
                    <span className="text-purple-500 font-medium">
                      Overall acknowledgment compliance rate
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Pending Reviews
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">142</p>
                  <div className="flex items-center text-sm">
                    <span className="text-orange-500 font-medium">
                      Policies with incomplete acknowledgment
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-black">
                    Due This Month
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-black">2</p>
                  <div className="flex items-center text-sm">
                    <span className="text-red-500 font-medium">
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
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Policy Name / Search
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-64"
                    placeholder="Search policies..."
                    value={sopFilters.policySearch}
                    onChange={(e) =>
                      handleSopFilterChange("policySearch", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Category
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={sopFilters.category}
                    onChange={(e) =>
                      handleSopFilterChange("category", e.target.value)
                    }
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Safety">Safety</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Quality">Quality</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Acknowledgment Status
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={sopFilters.acknowledgmentStatus}
                    onChange={(e) =>
                      handleSopFilterChange(
                        "acknowledgmentStatus",
                        e.target.value
                      )
                    }
                  >
                    <option value="All">All</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="Not Acknowledged">Not Acknowledged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black-700 mb-1">
                    Branch
                  </label>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={sopFilters.branch}
                    onChange={(e) =>
                      handleSopFilterChange("branch", e.target.value)
                    }
                  >
                    <option value="All Branches">All Branches</option>
                    <option value="Dubai Mall Pharmacy">
                      Dubai Mall Pharmacy
                    </option>
                    <option value="Abu Dhabi Marina Pharmacy">
                      Abu Dhabi Marina Pharmacy
                    </option>
                    <option value="Sharjah City Center Pharmacy">
                      Sharjah City Center Pharmacy
                    </option>
                    <option value="Dubai Healthcare City Pharmacy">
                      Dubai Healthcare City Pharmacy
                    </option>
                    <option value="Al Ain Pharmacy">Al Ain Pharmacy</option>
                  </select>
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
          </TabsContent>

          {/* Workforce Regulations Tab */}
          <TabsContent value="workforce">
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
                <TabsTrigger
                  value="employment-contracts"
                  className="text-black"
                >
                  Employment Contracts
                </TabsTrigger>
              </TabsList>

              {/* Sub Tab Content */}
              <TabsContent value="labor-law">
                {/* Dashboard Cards */}
                <div className="grid grid-cols-5 gap-6 mb-8">
                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Total Regulations Tracked
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">25</p>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-700">
                          Total number of UAE Labour Law regulations monitored
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Fully Compliant Areas
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">18</p>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 font-medium">
                          Number of regulation areas marked as "Compliant"
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        At Risk Areas
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">5</p>
                      <div className="flex items-center text-sm">
                        <span className="text-orange-500 font-medium">
                          Regulation areas nearing non-compliance
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Non-Compliant Areas
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">2</p>
                      <div className="flex items-center text-sm">
                        <span className="text-red-500 font-medium">
                          Number of areas currently failing compliance
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Last Verification Date
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">28 Jan</p>
                      <div className="flex items-center text-sm">
                        <span className="text-purple-500 font-medium">
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
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Compliance Status
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={workforceFilters.complianceStatus}
                        onChange={(e) =>
                          handleWorkforceFilterChange(
                            "complianceStatus",
                            e.target.value
                          )
                        }
                      >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Compliant">Compliant</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Non-Compliant">Non-Compliant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Regulation Area
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-2 w-64"
                        placeholder="Search or filter by specific Labor law areas"
                        value={workforceFilters.regulationArea}
                        onChange={(e) =>
                          handleWorkforceFilterChange(
                            "regulationArea",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Branch
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={workforceFilters.branch}
                        onChange={(e) =>
                          handleWorkforceFilterChange("branch", e.target.value)
                        }
                      >
                        <option value="All Branches">All Branches</option>
                        <option value="Dubai Mall Pharmacy">
                          Dubai Mall Pharmacy
                        </option>
                        <option value="Abu Dhabi Marina Pharmacy">
                          Abu Dhabi Marina Pharmacy
                        </option>
                        <option value="Sharjah City Center Pharmacy">
                          Sharjah City Center Pharmacy
                        </option>
                        <option value="Dubai Healthcare City Pharmacy">
                          Dubai Healthcare City Pharmacy
                        </option>
                        <option value="Al Ain Pharmacy">Al Ain Pharmacy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Category Type
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={workforceFilters.categoryType}
                        onChange={(e) =>
                          handleWorkforceFilterChange(
                            "categoryType",
                            e.target.value
                          )
                        }
                      >
                        <option value="All Categories">All Categories</option>
                        <option value="Leave">Leave</option>
                        <option value="Working Hours">Working Hours</option>
                        <option value="End of Service">End of Service</option>
                        <option value="Wages">Wages</option>
                        <option value="Employment">Employment</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="successOutline"
                      className="flex items-center"
                    >
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

              <TabsContent value="emiratization">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Emiratization Compliance
                  </h2>
                  <TableCustom
                    columns={workforceRegulationsColumns}
                    data={workforceRegulationsData.slice(0, 3)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="working-hours">
                {/* Dashboard Cards */}
                <div className="grid grid-cols-5 gap-6 mb-8">
                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Total Employees
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">293</p>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-700">
                          Total number of active employees included in
                          attendance tracking
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Under Contract
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">293</p>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 font-medium">
                          Total number of employees under valid employment
                          contracts
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Compliance Rate
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">75%</p>
                      <div className="flex items-center text-sm">
                        <span className="text-purple-500 font-medium">
                          % of branches within legal working hours
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Average Working Hours (hrs/week)
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">46.8</p>
                      <div className="flex items-center text-sm">
                        <span className="text-orange-500 font-medium">
                          Organization-wide average weekly hours
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Labor Law Compliance
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">
                        75% Compliant
                      </p>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 font-medium">
                          High-level summary
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Additional Recommended Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Total Overtime Hours (This Month)
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">1,247</p>
                      <div className="flex items-center text-sm">
                        <span className="text-red-500 font-medium">
                          Sum of all overtime hours logged across branches
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Branches At Risk
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">3</p>
                      <div className="flex items-center text-sm">
                        <span className="text-orange-500 font-medium">
                          Count of branches nearing or exceeding the legal limit
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Last Audit Date
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">25 Jan</p>
                      <div className="flex items-center text-sm">
                        <span className="text-blue-500 font-medium">
                          Date when working hour data was last reviewed or
                          verified
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Region
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={workingHoursFilters.region}
                        onChange={(e) =>
                          handleWorkingHoursFilterChange(
                            "region",
                            e.target.value
                          )
                        }
                      >
                        <option value="All Regions">All Regions</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Sharjah">Sharjah</option>
                        <option value="Al Ain">Al Ain</option>
                        <option value="Fujairah">Fujairah</option>
                        <option value="Ajman">Ajman</option>
                        <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Status
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={workingHoursFilters.status}
                        onChange={(e) =>
                          handleWorkingHoursFilterChange(
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Compliant">Compliant</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Non-Compliant">Non-Compliant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Branch
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-2 w-64"
                        placeholder="Search for a specific branch"
                        value={workingHoursFilters.branch}
                        onChange={(e) =>
                          handleWorkingHoursFilterChange(
                            "branch",
                            e.target.value
                          )
                        }
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
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Department (optional)
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={workingHoursFilters.department}
                        onChange={(e) =>
                          handleWorkingHoursFilterChange(
                            "department",
                            e.target.value
                          )
                        }
                      >
                        <option value="All Departments">All Departments</option>
                        <option value="Large Departments">
                          Large Departments (30+ staff)
                        </option>
                        <option value="Small Departments">
                          Small Departments {`(<30 staff)`}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="successOutline"
                      className="flex items-center"
                    >
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
                      <h3 className="text-sm font-medium text-black">
                        Total Employees
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">293</p>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-700">
                          Total employees having contract records
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Active Contracts
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">245</p>
                      <div className="flex items-center text-sm">
                        <span className="text-green-500 font-medium">
                          Count of currently valid employee contracts
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Expiring Soon
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">24</p>
                      <div className="flex items-center text-sm">
                        <span className="text-orange-500 font-medium">
                          Count of contracts nearing expiration (e.g., within 30
                          days)
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Expired Contracts
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">24</p>
                      <div className="flex items-center text-sm">
                        <span className="text-red-500 font-medium">
                          Count of contracts that have passed their end date
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-black">
                        Compliance Rate
                      </h3>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                        <Scale className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-black">84%</p>
                      <div className="flex items-center text-sm">
                        <span className="text-purple-500 font-medium">
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
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Branch
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={contractFilters.branch}
                        onChange={(e) =>
                          handleContractFilterChange("branch", e.target.value)
                        }
                      >
                        <option value="All Branches">All Branches</option>
                        <option value="Dubai Mall Pharmacy">
                          Dubai Mall Pharmacy
                        </option>
                        <option value="Abu Dhabi Marina Pharmacy">
                          Abu Dhabi Marina Pharmacy
                        </option>
                        <option value="Dubai Healthcare City Pharmacy">
                          Dubai Healthcare City Pharmacy
                        </option>
                        <option value="Sharjah City Center Pharmacy">
                          Sharjah City Center Pharmacy
                        </option>
                        <option value="Al Ain Pharmacy">Al Ain Pharmacy</option>
                        <option value="Fujairah Pharmacy">
                          Fujairah Pharmacy
                        </option>
                        <option value="Ajman Pharmacy">Ajman Pharmacy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Status
                      </label>
                      <select
                        className="border border-gray-300 rounded-md px-3 py-2"
                        value={contractFilters.status}
                        onChange={(e) =>
                          handleContractFilterChange("status", e.target.value)
                        }
                      >
                        <option value="All Statuses">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Expired">Expired</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Search by Employee Name/ID
                      </label>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-2 w-64"
                        placeholder="Search by employee name or ID"
                        value={contractFilters.search}
                        onChange={(e) =>
                          handleContractFilterChange("search", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="successOutline"
                      className="flex items-center"
                    >
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddLicenseModal
        isOpen={isAddLicenseModalOpen}
        onClose={() => setIsAddLicenseModalOpen(false)}
        onSave={handleAddLicense}
        existingLicenses={facilityLicenses}
      />

      <ViewLicenseModal
        isOpen={isViewLicenseModalOpen}
        onClose={() => setIsViewLicenseModalOpen(false)}
        licenseData={selectedLicense}
      />

      {isEditLicenseModalOpen && selectedLicense && (
        <EditLicenseModal
          isOpen={isEditLicenseModalOpen}
          onClose={() => setIsEditLicenseModalOpen(false)}
          onSave={handleEditLicense}
          licenseData={selectedLicense}
          existingLicenses={facilityLicenses}
        />
      )}

      <DeleteLicenseModal
        isOpen={isDeleteLicenseModalOpen}
        onClose={() => setIsDeleteLicenseModalOpen(false)}
        onConfirm={handleDeleteLicense}
        licenseData={selectedLicense}
      />
    </div>
  );
};

export default Compliance;
