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
  User,
  Scale,
  GraduationCap,
  FileText,
  ClipboardCheck,
  Users,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Building2,
  UserCheck,
  Trash2,
  RotateCcw,
} from "lucide-react";

const Compliance = () => {
  const [activeTab, setActiveTab] = useState("facility");
  const [activeSubTab, setActiveSubTab] = useState("branch-license");
  const [activeSOPSubTab, setActiveSOPSubTab] = useState("hr-policies");
  const [activeInspectionsSubTab, setActiveInspectionsSubTab] =
    useState("internal-audits");
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

  // Dummy data for compliance overview cards
  const complianceStats = [
    {
      id: "facility",
      title: "Branch & Licensing",
      percentage: 98,
      status: "valid",
      icon: Building,
      color: "purple",
    },
    {
      id: "license-certificates",
      title: "License & Certificates",
      percentage: 99,
      status: "valid",
      icon: User,
      color: "teal",
    },
    {
      id: "ratio",
      title: "Compliance Ratio",
      percentage: 95,
      status: "valid",
      icon: Scale,
      color: "orange",
    },
    {
      id: "training",
      title: "Mandatory Training",
      percentage: 92,
      status: "warning",
      icon: GraduationCap,
      color: "green",
    },
    {
      id: "sop",
      title: "SOP & Policy",
      percentage: 97,
      status: "valid",
      icon: FileText,
      color: "blue",
    },
    {
      id: "inspections",
      title: "Inspections & Audits",
      percentage: 96,
      status: "valid",
      icon: ClipboardCheck,
      color: "pink",
    },
    {
      id: "workforce",
      title: "Workforce Regulations",
      percentage: 100,
      status: "valid",
      icon: Users,
      color: "gray",
    },
  ];

  // Dummy data for facility licensing table
  const facilityLicensesData = [
    {
      id: 1,
      facilityName: "Dubai Mall Pharmacy",
      licenseNumber: "DHA-FL-2023-001",
      licenseType: "Retail Pharmacy License",
      issuingAuthority: "Dubai Health Authority",
      issueDate: "2023-01-15",
      expiryDate: "2026-01-15",
      location: "Dubai Mall, Dubai",
      status: "Active",
      complianceScore: 98,
      renewalIntimations: 0,
    },
    {
      id: 2,
      facilityName: "Abu Dhabi Marina Pharmacy",
      licenseNumber: "DOH-FL-2022-045",
      licenseType: "Retail Pharmacy License",
      issuingAuthority: "Department of Health Abu Dhabi",
      issueDate: "2022-11-03",
      expiryDate: "2025-11-03",
      location: "Marina Walk, Abu Dhabi",
      status: "Active",
      complianceScore: 95,
      renewalIntimations: 0,
    },
    {
      id: 3,
      facilityName: "Sharjah City Center Pharmacy",
      licenseNumber: "SHD-FL-2023-012",
      licenseType: "Retail Pharmacy License",
      issuingAuthority: "Sharjah Health Department",
      issueDate: "2023-03-20",
      expiryDate: "2026-03-20",
      location: "City Center, Sharjah",
      status: "Expiring Soon",
      complianceScore: 92,
      renewalIntimations: 1,
    },
    {
      id: 4,
      facilityName: "Dubai Healthcare City Pharmacy",
      licenseNumber: "DHA-FL-2023-078",
      licenseType: "Retail Pharmacy License",
      issuingAuthority: "Dubai Health Authority",
      issueDate: "2023-06-10",
      expiryDate: "2026-06-10",
      location: "Healthcare City, Dubai",
      status: "Active",
      complianceScore: 99,
      renewalIntimations: 0,
    },
    {
      id: 5,
      facilityName: "Dubai Warehouse Facility",
      licenseNumber: "DHA-WH-2023-001",
      licenseType: "Warehouse License",
      issuingAuthority: "Dubai Health Authority",
      issueDate: "2023-02-01",
      expiryDate: "2026-02-01",
      location: "Dubai Industrial City",
      status: "Active",
      complianceScore: 97,
      renewalIntimations: 0,
    },
    {
      id: 6,
      facilityName: "Abu Dhabi Clinical Center",
      licenseNumber: "DOH-CL-2023-002",
      licenseType: "Clinical License",
      issuingAuthority: "Department of Health Abu Dhabi",
      issueDate: "2023-04-15",
      expiryDate: "2026-04-15",
      location: "Abu Dhabi Medical City",
      status: "Renewal Tracking",
      complianceScore: 94,
      renewalIntimations: 2,
      renewalInitiatedAt: "2023-10-01T10:00:00Z",
    },
  ];

  // Dummy data for employee licenses/certificates table
  const employeeLicensesData = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "Sarah Ahmed",
      designation: "Pharmacist",
      type: "License",
      issueAuthority: "Dubai Health Authority",
      issuanceDate: "2023-01-15",
      expiryDate: "2026-01-15",
      branch: "Dubai Mall Pharmacy",
      status: "Active",
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Mohammed Khan",
      designation: "Pharmacy Technician",
      type: "Certificate",
      issueAuthority: "Department of Health Abu Dhabi",
      issuanceDate: "2022-11-03",
      expiryDate: "2025-11-03",
      branch: "Abu Dhabi Marina Pharmacy",
      status: "Expiring Soon",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "John Anderson",
      designation: "Pharmacist",
      type: "License",
      issueAuthority: "Dubai Health Authority",
      issuanceDate: "2023-03-20",
      expiryDate: "2026-03-20",
      branch: "Dubai Healthcare City Pharmacy",
      status: "Active",
    },
    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Fatima Al-Zahra",
      designation: "Manager",
      type: "Certificate",
      issueAuthority: "Ministry of Health UAE",
      issuanceDate: "2023-06-10",
      expiryDate: "2026-06-10",
      branch: "Sharjah City Center Pharmacy",
      status: "Renewal In Progress",
    },
    {
      id: 5,
      employeeId: "EMP005",
      employeeName: "Ahmed Hassan",
      designation: "Supervisor",
      type: "License",
      issueAuthority: "Department of Health Abu Dhabi",
      issuanceDate: "2022-08-15",
      expiryDate: "2025-08-15",
      branch: "Al Ain Pharmacy",
      status: "Active",
    },
    {
      id: 6,
      employeeId: "EMP006",
      employeeName: "Lisa Johnson",
      designation: "Pharmacist",
      type: "License",
      issueAuthority: "Dubai Health Authority",
      issuanceDate: "2023-02-01",
      expiryDate: "2026-02-01",
      branch: "Dubai Mall Pharmacy",
      status: "Expired",
    },
    {
      id: 7,
      employeeId: "EMP007",
      employeeName: "Omar Al-Rashid",
      designation: "Pharmacy Technician",
      type: "Certificate",
      issueAuthority: "Sharjah Health Department",
      issuanceDate: "2023-04-15",
      expiryDate: "2026-04-15",
      branch: "Sharjah City Center Pharmacy",
      status: "Active",
    },
    {
      id: 8,
      employeeId: "EMP008",
      employeeName: "Maria Rodriguez",
      designation: "Cashier",
      type: "Certificate",
      issueAuthority: "Ministry of Health UAE",
      issuanceDate: "2023-07-20",
      expiryDate: "2026-07-20",
      branch: "Abu Dhabi Marina Pharmacy",
      status: "Expiring Soon",
    },
  ];

  // Dummy data for mandatory training table
  const mandatoryTrainingData = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "Sarah Ahmed",
      designation: "Pharmacist",
      branch: "Dubai Mall Pharmacy",
      trainingProgramName: "UAE Labor Law Compliance",
      frequency: "Annual",
      completionRatio: 100,
      status: "Completed",
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Mohammed Khan",
      designation: "Pharmacy Technician",
      branch: "Abu Dhabi Marina Pharmacy",
      trainingProgramName: "Workplace Safety & Health",
      frequency: "Quarterly",
      completionRatio: 75,
      status: "In Progress",
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "John Anderson",
      designation: "Pharmacist",
      branch: "Dubai Healthcare City Pharmacy",
      trainingProgramName: "UAE Pharmacy Regulations",
      frequency: "Annual",
      completionRatio: 0,
      status: "Pending",
    },
    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Fatima Al-Zahra",
      designation: "Manager",
      branch: "Sharjah City Center Pharmacy",
      trainingProgramName: "Fire Safety & Emergency Response",
      frequency: "Monthly",
      completionRatio: 100,
      status: "Completed",
    },
    {
      id: 5,
      employeeId: "EMP005",
      employeeName: "Ahmed Hassan",
      designation: "Supervisor",
      branch: "Al Ain Pharmacy",
      trainingProgramName: "Data Privacy & GDPR Compliance",
      frequency: "Annual",
      completionRatio: 50,
      status: "In Progress",
    },
    {
      id: 6,
      employeeId: "EMP006",
      employeeName: "Lisa Johnson",
      designation: "Pharmacist",
      branch: "Dubai Mall Pharmacy",
      trainingProgramName: "Patient Counseling Excellence",
      frequency: "Quarterly",
      completionRatio: 0,
      status: "Pending",
    },
    {
      id: 7,
      employeeId: "EMP007",
      employeeName: "Omar Al-Rashid",
      designation: "Pharmacy Technician",
      branch: "Sharjah City Center Pharmacy",
      trainingProgramName: "UAE Labor Law Compliance",
      frequency: "Annual",
      completionRatio: 100,
      status: "Completed",
    },
    {
      id: 8,
      employeeId: "EMP008",
      employeeName: "Maria Rodriguez",
      designation: "Cashier",
      branch: "Abu Dhabi Marina Pharmacy",
      trainingProgramName: "Workplace Safety & Health",
      frequency: "Monthly",
      completionRatio: 25,
      status: "In Progress",
    },
  ];

  // Dummy data for SOP & Policy table
  const sopPolicyData = [
    {
      id: 1,
      policyName: "Employee Code of Conduct",
      changeType: "Major Update",
      version: "v3.2",
      changedBy: "Sarah Al-Mansoori",
      changeDate: "15 Sep 2023",
      summary: "Updated social media guidelines",
      status: "Active",
    },
    {
      id: 2,
      policyName: "Workplace Safety Policy",
      changeType: "Minor Update",
      version: "v2.1",
      changedBy: "Safety Team",
      changeDate: "10 Sep 2023",
      summary: "Updated emergency procedures",
      status: "Active",
    },
    {
      id: 3,
      policyName: "Data Protection Policy",
      changeType: "Major Update",
      version: "v4.0",
      changedBy: "Legal Team",
      changeDate: "05 Sep 2023",
      summary: "GDPR compliance updates",
      status: "Active",
    },
    {
      id: 4,
      policyName: "Leave Management Policy",
      changeType: "Minor Update",
      version: "v1.5",
      changedBy: "HR Team",
      changeDate: "01 Sep 2023",
      summary: "Updated leave calculation rules",
      status: "Active",
    },
  ];

  const stats = [
    {
      id: "facility",
      icon: Building2,
      label: "Licensing",
      fullName: "Branch & Licensing",
      value: "98%",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: "license-certificates",
      icon: UserCheck,
      label: "License & Certificates",
      fullName: "License & Certificates",
      value: "99%",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      id: "ratio",
      icon: Scale,
      label: " Compliance Ratio",
      fullName: "Compliance Ratio",
      value: "95%",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: "training",
      icon: GraduationCap,
      label: "Training",
      fullName: "Mandatory Training",
      value: "92%",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      warning: true,
    },
    {
      id: "sop",
      icon: FileText,
      label: "SOP",
      fullName: "SOP & Policy",
      value: "97%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "inspections",
      icon: ClipboardCheck,
      label: "Inspections",
      fullName: "Inspections & Audits",
      value: "96%",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      id: "workforce",
      icon: Users,
      label: "Workforce",
      fullName: "Workforce Regulations",
      value: "100%",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
    },
  ];

  // Dummy data for Inspections & Audits table
  const inspectionsAuditsData = [
    {
      id: 1,
      auditType: "HR Compliance",
      location: "Dubai Mall Pharmacy",
      auditDate: "25 Sep 2023",
      auditor: "Internal Audit Team",
      score: 97,
      status: "Completed",
      findings: 2,
    },
    {
      id: 2,
      auditType: "Labor Law",
      location: "Abu Dhabi Marina Pharmacy",
      auditDate: "22 Sep 2023",
      auditor: "External Auditor",
      score: 95,
      status: "Completed",
      findings: 1,
    },
    {
      id: 3,
      auditType: "Workplace Safety",
      location: "Sharjah City Center Pharmacy",
      auditDate: "20 Sep 2023",
      auditor: "Safety Inspector",
      score: 93,
      status: "Completed",
      findings: 3,
    },
    {
      id: 4,
      auditType: "Document Review",
      location: "Dubai Healthcare City Pharmacy",
      auditDate: "18 Sep 2023",
      auditor: "Compliance Officer",
      score: 96,
      status: "Completed",
      findings: 1,
    },
  ];

  // Dummy data for Workforce Regulations table
  const workforceRegulationsData = [
    {
      id: 1,
      regulationArea: "Maximum Working Hours",
      requirement: "48 hrs/week (8 hrs/day)",
      currentStatus: "Avg: 46.2 hrs/week",
      locationsCompliant: "238 / 238",
      lastVerified: "30 Sep 2023",
      status: "Compliant",
    },
    {
      id: 2,
      regulationArea: "Annual Leave",
      requirement: "30 days/year (after 1 year)",
      currentStatus: "Tracked & Accrued",
      locationsCompliant: "238 / 238",
      lastVerified: "30 Sep 2023",
      status: "Compliant",
    },
    {
      id: 3,
      regulationArea: "Sick Leave",
      requirement: "90 days/year (15 full, 30 half)",
      currentStatus: "Tracked & Documented",
      locationsCompliant: "238 / 238",
      lastVerified: "30 Sep 2023",
      status: "Compliant",
    },
    {
      id: 4,
      regulationArea: "End of Service Benefits",
      requirement: "21 days per year (1-5 yrs)",
      currentStatus: "Calculated & Reserved",
      locationsCompliant: "238 / 238",
      lastVerified: "30 Sep 2023",
      status: "Compliant",
    },
    {
      id: 5,
      regulationArea: "Wage Protection System",
      requirement: "WPS Registration Required",
      currentStatus: "All Staff Registered",
      locationsCompliant: "238 / 238",
      lastVerified: "30 Sep 2023",
      status: "Compliant",
    },
  ];

  // Column definitions for SOP & Policy table
  const sopPolicyColumns = [
    {
      dataField: "policyName",
      text: "Policy Name",
    },
    {
      dataField: "changeType",
      text: "Change Type",
      formatter: (cell, row) => (
        <Badge
          variant={row.changeType === "Major Update" ? "warning" : "success"}
          className="capitalize"
        >
          {row.changeType}
        </Badge>
      ),
    },
    {
      dataField: "version",
      text: "Version",
    },
    {
      dataField: "changedBy",
      text: "Changed By",
    },
    {
      dataField: "changeDate",
      text: "Change Date",
    },
    {
      dataField: "summary",
      text: "Summary",
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Column definitions for Inspections & Audits table
  const inspectionsAuditsColumns = [
    {
      dataField: "auditType",
      text: "Audit Type",
    },
    {
      dataField: "location",
      text: "Location",
    },
    {
      dataField: "auditDate",
      text: "Audit Date",
    },
    {
      dataField: "auditor",
      text: "Auditor",
    },
    {
      dataField: "score",
      text: "Score",
      formatter: (cell, row) => (
        <span className="font-semibold text-green-600">{row.score}%</span>
      ),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge variant="success" className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      dataField: "findings",
      text: "Findings",
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Column definitions for Workforce Regulations table
  const workforceRegulationsColumns = [
    {
      dataField: "regulationArea",
      text: "Regulation Area",
    },
    {
      dataField: "requirement",
      text: "Requirement",
    },
    {
      dataField: "currentStatus",
      text: "Current Status",
    },
    {
      dataField: "locationsCompliant",
      text: "Locations Compliant",
    },
    {
      dataField: "lastVerified",
      text: "Last Verified",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge variant="success" className="capitalize">
          {row.status}
        </Badge>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Dummy data for Compliance Ratio table
  const complianceRatioData = [
    {
      id: 1,
      branch: "Dubai Mall Pharmacy",
      country: "UAE",
      city: "Dubai",
      requiredRatio: 95,
      currentRatio: 98,
      status: "Compliant",
    },
    {
      id: 2,
      branch: "Abu Dhabi Marina Pharmacy",
      country: "UAE",
      city: "Abu Dhabi",
      requiredRatio: 95,
      currentRatio: 92,
      status: "At Risk",
    },
    {
      id: 3,
      branch: "Sharjah City Center Pharmacy",
      country: "UAE",
      city: "Sharjah",
      requiredRatio: 95,
      currentRatio: 88,
      status: "Non-Compliant",
    },
    {
      id: 4,
      branch: "Al Ain Pharmacy",
      country: "UAE",
      city: "Al Ain",
      requiredRatio: 95,
      currentRatio: 96,
      status: "Compliant",
    },
    {
      id: 5,
      branch: "Dubai Healthcare City Pharmacy",
      country: "UAE",
      city: "Dubai",
      requiredRatio: 95,
      currentRatio: 97,
      status: "Compliant",
    },
    {
      id: 6,
      branch: "Fujairah Pharmacy",
      country: "UAE",
      city: "Fujairah",
      requiredRatio: 95,
      currentRatio: 90,
      status: "At Risk",
    },
    {
      id: 7,
      branch: "Ajman Pharmacy",
      country: "UAE",
      city: "Ajman",
      requiredRatio: 95,
      currentRatio: 85,
      status: "Non-Compliant",
    },
    {
      id: 8,
      branch: "Ras Al Khaimah Pharmacy",
      country: "UAE",
      city: "Ras Al Khaimah",
      requiredRatio: 95,
      currentRatio: 94,
      status: "Compliant",
    },
  ];

  // Column definitions for Compliance Ratio table
  const complianceRatioColumns = [
    {
      dataField: "branch",
      text: "Branch",
    },
    {
      dataField: "country",
      text: "Country",
    },
    {
      dataField: "city",
      text: "City",
    },
    {
      dataField: "requiredRatio",
      text: "Required Ratio (%)",
      formatter: (cell, row) => (
        <span className="font-semibold">{row.requiredRatio}%</span>
      ),
    },
    {
      dataField: "currentRatio",
      text: "Current Ratio (%)",
      formatter: (cell, row) => (
        <span className="font-semibold">{row.currentRatio}%</span>
      ),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge
          variant={
            row.status === "Compliant"
              ? "success"
              : row.status === "At Risk"
              ? "warning"
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
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("View details for:", row);
            }}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Dummy data for SOP Policy Management table
  const sopPolicyManagementData = [
    {
      id: 1,
      policyName: "Employee Code of Conduct",
      category: "Employee Relations",
      version: "v3.2",
      lastUpdated: "15 Sep 2023",
      nextReview: "15 Sep 2024",
      acknowledgmentRate: 99,
      status: "Active",
    },
    {
      id: 2,
      policyName: "Workplace Safety Policy",
      category: "Health & Safety",
      version: "v2.1",
      lastUpdated: "10 Sep 2023",
      nextReview: "10 Sep 2024",
      acknowledgmentRate: 98,
      status: "Active",
    },
    {
      id: 3,
      policyName: "Data Protection Policy",
      category: "Information Security",
      version: "v4.0",
      lastUpdated: "05 Sep 2023",
      nextReview: "05 Sep 2024",
      acknowledgmentRate: 95,
      status: "Active",
    },
    {
      id: 4,
      policyName: "Leave Management Policy",
      category: "Employee Relations",
      version: "v1.5",
      lastUpdated: "01 Sep 2023",
      nextReview: "01 Sep 2024",
      acknowledgmentRate: 97,
      status: "Active",
    },
    {
      id: 5,
      policyName: "Professional Development Policy",
      category: "Employee Relations",
      version: "v1.9",
      lastUpdated: "15 Apr 2023",
      nextReview: "15 Apr 2024",
      acknowledgmentRate: 91,
      status: "Active",
    },
    {
      id: 6,
      policyName: "Social Media & Communications",
      category: "Professional Conduct",
      version: "v2.0",
      lastUpdated: "10 Mar 2023",
      nextReview: "10 Oct 2023",
      acknowledgmentRate: 85,
      status: "Review Due",
    },
  ];

  // Column definitions for SOP Policy Management table
  const sopPolicyManagementColumns = [
    {
      dataField: "policyName",
      text: "Policy Name",
    },
    {
      dataField: "category",
      text: "Category",
    },
    {
      dataField: "version",
      text: "Version",
    },
    {
      dataField: "lastUpdated",
      text: "Last Updated",
    },
    {
      dataField: "nextReview",
      text: "Next Review",
    },
    {
      dataField: "acknowledgmentRate",
      text: "Acknowledgment Rate",
      formatter: (cell, row) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div
              className={`h-2.5 rounded-full ${
                row.acknowledgmentRate >= 95
                  ? "bg-green-500"
                  : row.acknowledgmentRate >= 90
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${row.acknowledgmentRate}%` }}
            ></div>
          </div>
          <span>{row.acknowledgmentRate}%</span>
        </div>
      ),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge
          variant={row.status === "Active" ? "success" : "warning"}
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
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Chart data
  const complianceChartData = {
    categories: [
      "Facility",
      "License & Certificates",
      "Ratio",
      "Training",
      "SOP",
      "Inspections",
      "Workforce",
    ],
    series: [
      {
        name: "Compliance Rate",
        data: [98, 99, 95, 92, 97, 96, 100],
      },
    ],
  };

  // Table columns configuration for mandatory training
  const mandatoryTrainingColumns = [
    {
      dataField: "employeeId",
      text: "Employee ID",
    },
    {
      dataField: "employeeName",
      text: "Employee Name",
      formatter: (cell, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="font-semibold text-blue-700 text-sm">
              {row.employeeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span className="font-medium">{row.employeeName}</span>
        </div>
      ),
    },
    {
      dataField: "designation",
      text: "Designation",
    },
    {
      dataField: "branch",
      text: "Branch",
    },
    {
      dataField: "trainingProgramName",
      text: "Training Program Name",
    },
    {
      dataField: "frequency",
      text: "Frequency",
      formatter: (cell, row) => (
        <Badge
          variant={
            row.frequency === "Annual"
              ? "success"
              : row.frequency === "Quarterly"
              ? "warning"
              : "secondary"
          }
          className="capitalize"
        >
          {row.frequency}
        </Badge>
      ),
    },
    {
      dataField: "completionRatio",
      text: "Completion Ratio (%)",
      formatter: (cell, row) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div
              className={`h-2.5 rounded-full ${
                row.completionRatio >= 100
                  ? "bg-green-500"
                  : row.completionRatio >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${row.completionRatio}%` }}
            ></div>
          </div>
          <span className="font-semibold">{row.completionRatio}%</span>
        </div>
      ),
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge
          variant={
            row.status === "Completed"
              ? "success"
              : row.status === "In Progress"
              ? "warning"
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
      text: "Action",
      formatter: (cell, row) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("View details for:", row);
            }}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Table columns configuration for employee licenses/certificates
  const employeeLicensesColumns = [
    {
      dataField: "employeeId",
      text: "Employee ID",
    },
    {
      dataField: "employeeName",
      text: "Employee Name",
      formatter: (cell, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="font-semibold text-blue-700 text-sm">
              {row.employeeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span className="font-medium">{row.employeeName}</span>
        </div>
      ),
    },
    {
      dataField: "designation",
      text: "Designation",
    },
    {
      dataField: "type",
      text: "Type",
      formatter: (cell, row) => (
        <Badge
          variant={row.type === "License" ? "success" : "secondary"}
          className="capitalize"
        >
          {row.type}
        </Badge>
      ),
    },
    {
      dataField: "issueAuthority",
      text: "Issue Authority",
    },
    {
      dataField: "issuanceDate",
      text: "Issuance Date",
    },
    {
      dataField: "expiryDate",
      text: "Expiry Date",
    },
    {
      dataField: "branch",
      text: "Branch",
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
              : row.status === "Renewal In Progress"
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
              console.log("View employee license:", row);
            }}
            title="View"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {(row.status === "Expiring Soon" || row.status === "Active") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log("Proceed for renewal:", row);
              }}
              title="Proceed for Renewal"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Table columns configuration
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
        {/* Page Header */}
        {/* <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pharmacy Compliance Hub
          </h1>
        </div> */}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          {/* <TabsList className="bg-transparent">
            <TabsTrigger value="facility" variant="inner-tab">
              Facility Licensing
            </TabsTrigger>
            <TabsTrigger value="professional" variant="inner-tab">
              Professional Licensing
            </TabsTrigger>
            <TabsTrigger value="ratio" variant="inner-tab">
              Ratio Compliance
            </TabsTrigger>
            <TabsTrigger value="training" variant="inner-tab">
              Mandatory Training
            </TabsTrigger>
            <TabsTrigger value="sop" variant="inner-tab">
              SOP & Policy
            </TabsTrigger>
            <TabsTrigger value="inspections" variant="inner-tab">
              Inspections & Audits
            </TabsTrigger>
            <TabsTrigger value="workforce" variant="inner-tab">
              Workforce Regulations
            </TabsTrigger>
          </TabsList> */}

          <div className="grid grid-cols-7 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                // className="border-slate-200 hover:shadow-lg transition-shadow"
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
                        : "text-slate-900"
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
                          : "text-slate-900"
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
                  <TabsTrigger value={stat.id} variant="inner-tab">
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
                <TabsTrigger value="branch-license">Branch License</TabsTrigger>
                <TabsTrigger value="renewal-tracking">
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
                          <h3 className="text-sm font-medium">
                            Total Facilities
                          </h3>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-gray-900">
                            {metrics.totalFacilities}
                          </p>
                          <div className="flex items-center text-sm">
                            <span className="text-green-500 font-medium mr-1">
                              ↑ {Math.floor(metrics.totalFacilities * 0.05)}
                            </span>
                            <span className="text-gray-500">
                              from last year
                            </span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium">
                            Licenses Expiring
                          </h3>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-gray-900">
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
                          <h3 className="text-sm font-medium">
                            Renewal In Progress
                          </h3>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 text-blue-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-gray-900">
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
                          <h3 className="text-sm font-medium">
                            Compliance Rate
                          </h3>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-bold text-gray-900">
                            {metrics.complianceRate}%
                          </p>
                          <div className="flex items-center text-sm">
                            <span className="text-green-500 font-medium mr-1">
                              ↑ {Math.floor(metrics.complianceRate * 0.02)}%
                            </span>
                            <span className="text-gray-500">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <h3 className="text-sm font-medium">Total Employees</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">245</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">
                      with licenses/certificates
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">
                    Expiring within 60 Days
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">18</p>
                  <div className="flex items-center text-sm">
                    <span className="text-orange-500 font-medium">
                      Require attention
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Renewal in Progress</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">12</p>
                  <div className="flex items-center text-sm">
                    <span className="text-blue-500 font-medium">
                      Applications submitted
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Compliance Ratio</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">94%</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 font-medium mr-1">
                      ↑ 2%
                    </span>
                    <span className="text-gray-500">from last quarter</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Employee Name / ID
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-3 py-2 w-64"
                    placeholder="Search employee..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select className="border border-gray-300 rounded-md px-3 py-2">
                    <option>All Branches</option>
                    <option>Dubai Mall Pharmacy</option>
                    <option>Abu Dhabi Marina Pharmacy</option>
                    <option>Sharjah City Center Pharmacy</option>
                    <option>Dubai Healthcare City Pharmacy</option>
                    <option>Al Ain Pharmacy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <select className="border border-gray-300 rounded-md px-3 py-2">
                    <option>All Designations</option>
                    <option>Pharmacist</option>
                    <option>Pharmacy Technician</option>
                    <option>Manager</option>
                    <option>Supervisor</option>
                    <option>Cashier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select className="border border-gray-300 rounded-md px-3 py-2">
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
                  data={employeeLicensesData}
                  pagination={true}
                  dataTotalSize={employeeLicensesData.length}
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
                  <h3 className="text-sm font-medium">
                    Total Assigned Trainings
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">
                      All mandatory trainings assigned
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Completed Trainings</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 font-medium">
                      Successfully completed
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">In Progress Trainings</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <div className="flex items-center text-sm">
                    <span className="text-blue-500 font-medium">
                      Currently being completed
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">
                    Pending / Overdue Trainings
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <div className="flex items-center text-sm">
                    <span className="text-orange-500 font-medium">
                      Due or not started
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Compliance %</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">37.5%</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <h3 className="text-sm font-medium">
                    Total Locations (Cities)
                  </h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">7</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">
                      Unique cities with branches
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Total Branches</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500">All branches</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Non-Compliant Count</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <div className="flex items-center text-sm">
                    <span className="text-red-500 font-medium mr-1">
                      Branches marked as Non-Compliant
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Average Compliance %</h3>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-900">92.5%</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
            {/* Sub Tabs */}
            <Tabs
              value={activeSOPSubTab}
              onValueChange={setActiveSOPSubTab}
              className="mb-6"
            >
              <TabsList className="grid-cols-4">
                <TabsTrigger value="hr-policies">HR Policies</TabsTrigger>
                <TabsTrigger value="document-management">
                  Document Management
                </TabsTrigger>
                <TabsTrigger value="policy-compliance">
                  Policy Compliance
                </TabsTrigger>
                <TabsTrigger value="policy-updates">Policy Updates</TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Policies</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">42</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Active documents</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Staff Acknowledged</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">97%</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        594 of 612
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Pending Reviews</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">5</p>
                    <div className="flex items-center text-sm">
                      <span className="text-orange-500 font-medium">
                        Due this month
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">
                      Updated This Quarter
                    </h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">8</p>
                    <div className="flex items-center text-sm">
                      <span className="text-purple-500 font-medium mr-1">
                        Policy revisions
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="hr-policies">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Policy Acknowledgment Status
                  </h2>
                  <TableCustom
                    columns={sopPolicyColumns}
                    data={sopPolicyData}
                    tableOptions={{
                      pagination: true,
                      paginationSize: 10,
                      paginationSizePerPageList: [10, 20, 50],
                      showTotal: true,
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="document-management">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Document Repository
                  </h2>
                  <TableCustom
                    columns={sopPolicyManagementColumns}
                    data={sopPolicyManagementData.slice(0, 4)}
                    pagination={true}
                    dataTotalSize={4}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="policy-compliance">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Policy Compliance</h2>
                  <TableCustom
                    columns={sopPolicyManagementColumns}
                    data={sopPolicyManagementData.slice(2, 6)}
                    pagination={true}
                    dataTotalSize={4}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="policy-updates">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Recent Policy Changes (Last 90 Days)
                  </h2>
                  <TableCustom
                    columns={sopPolicyColumns}
                    data={sopPolicyData}
                    pagination={true}
                    dataTotalSize={sopPolicyData.length}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Inspections & Audits Tab */}
          <TabsContent value="inspections">
            {/* Sub Tabs */}
            <Tabs
              value={activeInspectionsSubTab}
              onValueChange={setActiveInspectionsSubTab}
              className="mb-6"
            >
              <TabsList className="grid-cols-4">
                <TabsTrigger value="internal-audits">
                  Internal Audits
                </TabsTrigger>
                <TabsTrigger value="external-inspections">
                  External Inspections
                </TabsTrigger>
                <TabsTrigger value="audit-findings">Audit Findings</TabsTrigger>
                <TabsTrigger value="corrective-actions">
                  Corrective Actions
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Audits (YTD)</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">48</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Completed this year</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Average Score</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">96%</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium">
                        Compliance rate
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Open Findings</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 font-medium">
                        Require action
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Scheduled Audits</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">8</p>
                    <div className="flex items-center text-sm">
                      <span className="text-plum-900 font-medium mr-1">
                        Next 90 days
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="audit-schedule">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Audit Schedule</h2>
                  <TableCustom
                    columns={inspectionsAuditsColumns}
                    data={inspectionsAuditsData}
                    tableOptions={{
                      pagination: true,
                      paginationSize: 10,
                      paginationSizePerPageList: [10, 20, 50],
                      showTotal: true,
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="inspection-reports">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Inspection Reports</h2>
                  <TableCustom
                    columns={inspectionsAuditsColumns}
                    data={inspectionsAuditsData.slice(0, 3)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="compliance-scores">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Compliance Scores</h2>
                  <TableCustom
                    columns={inspectionsAuditsColumns}
                    data={inspectionsAuditsData.slice(1, 4)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>
            </Tabs>
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
                <TabsTrigger value="labor-law">UAE Labor Law</TabsTrigger>
                <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
                <TabsTrigger value="employment-contracts">
                  Employment Contracts
                </TabsTrigger>
                <TabsTrigger value="benefits-entitlements">
                  Benefits & Entitlements
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Employees</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">612</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Under contract </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Compliance Rate</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">100%</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium">
                        Labor law compliant
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Contracts Expiring </h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">24</p>
                    <div className="flex items-center text-sm">
                      <span className="text-purple-500 font-medium">
                        Within 90 days
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Avg. Working Hours</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">46.2</p>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-1">hours/week</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="labor-law">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    UAE Labor Law Compliance Status
                  </h2>
                  <TableCustom
                    columns={workforceRegulationsColumns}
                    data={workforceRegulationsData}
                    tableOptions={{
                      pagination: true,
                      paginationSize: 10,
                      paginationSizePerPageList: [10, 20, 50],
                      showTotal: true,
                    }}
                  />
                </div>
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
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Working Hours Compliance
                  </h2>
                  <TableCustom
                    columns={workforceRegulationsColumns}
                    data={workforceRegulationsData.slice(2, 5)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
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
