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
} from "lucide-react";

const Compliance = () => {
  const [activeTab, setActiveTab] = useState("facility");
  const [activeSubTab, setActiveSubTab] = useState("retail-licenses");
  const [activeProfessionalSubTab, setActiveProfessionalSubTab] = useState(
    "pharmacist-licenses"
  );
  const [activeRatioSubTab, setActiveRatioSubTab] = useState("current-ratios");
  const [activeTrainingSubTab, setActiveTrainingSubTab] =
    useState("training-modules");
  const [activeSOPSubTab, setActiveSOPSubTab] = useState("hr-policies");
  const [activeInspectionsSubTab, setActiveInspectionsSubTab] =
    useState("internal-audits");
  const [activeWorkforceSubTab, setActiveWorkforceSubTab] =
    useState("labor-law");
  const [vs2, setVs2] = useState(false);
  console.log(vs2, "vs2");
  // Check for v2 parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const v2Param = urlParams.get("v2");
    setVs2(v2Param === "true");
  }, []);

  // Dummy data for compliance overview cards
  const complianceStats = [
    {
      id: "facility",
      title: "Facility Licensing",
      percentage: 98,
      status: "valid",
      icon: Building,
      color: "purple",
    },
    {
      id: "professional",
      title: "Professional Licensing",
      percentage: 99,
      status: "valid",
      icon: User,
      color: "teal",
    },
    {
      id: "ratio",
      title: "Ratio Compliance",
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
      issuingAuthority: "Dubai Health Authority",
      issueDate: "2023-01-15",
      expiryDate: "2026-01-15",
      location: "Dubai Mall, Dubai",
      status: "Active",
      complianceScore: 98,
    },
    {
      id: 2,
      facilityName: "Abu Dhabi Marina Pharmacy",
      licenseNumber: "DOH-FL-2022-045",
      issuingAuthority: "Department of Health Abu Dhabi",
      issueDate: "2022-11-03",
      expiryDate: "2025-11-03",
      location: "Marina Walk, Abu Dhabi",
      status: "Active",
      complianceScore: 95,
    },
    {
      id: 3,
      facilityName: "Sharjah City Center Pharmacy",
      licenseNumber: "SHD-FL-2023-012",
      issuingAuthority: "Sharjah Health Department",
      issueDate: "2023-03-20",
      expiryDate: "2026-03-20",
      location: "City Center, Sharjah",
      status: "Expiring Soon",
      complianceScore: 92,
    },
    {
      id: 4,
      facilityName: "Dubai Healthcare City Pharmacy",
      licenseNumber: "DHA-FL-2023-078",
      issuingAuthority: "Dubai Health Authority",
      issueDate: "2023-06-10",
      expiryDate: "2026-06-10",
      location: "Healthcare City, Dubai",
      status: "Active",
      complianceScore: 99,
    },
  ];

  // Dummy data for professional licensing table
  const professionalLicensesData = [
    {
      id: 1,
      name: "Sarah Ahmed",
      licenseNumber: "DHA-PH-2023-45678",
      issuingAuthority: "Dubai Health Authority",
      issueDate: "15 Dec 2022",
      expiryDate: "15 Dec 2025",
      primaryLocation: "Dubai Mall Pharmacy",
      status: "Active",
    },
    {
      id: 2,
      name: "Mohammed Khan",
      licenseNumber: "DOH-PH-2022-12345",
      issuingAuthority: "Department of Health Abu Dhabi",
      issueDate: "03 Nov 2021",
      expiryDate: "03 Nov 2023",
      primaryLocation: "Abu Dhabi Marina Pharmacy",
      status: "Expiring Soon",
    },
    {
      id: 3,
      name: "John Anderson",
      licenseNumber: "DHA-PH-2023-56789",
      issuingAuthority: "Dubai Health Authority",
      issueDate: "10 Jan 2023",
      expiryDate: "10 Jan 2026",
      primaryLocation: "Dubai Healthcare City Pharmacy",
      status: "Active",
    },
    {
      id: 4,
      name: "Fatima Al-Zahra",
      licenseNumber: "MOH-PH-2023-78901",
      issuingAuthority: "Ministry of Health Sharjah",
      issueDate: "20 Mar 2023",
      expiryDate: "20 Mar 2026",
      primaryLocation: "Sharjah City Center Pharmacy",
      status: "Active",
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      licenseNumber: "DOH-PH-2022-23456",
      issuingAuthority: "Department of Health Abu Dhabi",
      issueDate: "15 Aug 2021",
      expiryDate: "15 Aug 2024",
      primaryLocation: "Al Ain Pharmacy",
      status: "Active",
    },
  ];

  // Dummy data for training sessions table
  const trainingSessionsData = [
    {
      id: 1,
      trainingModule: "UAE Labor Law Compliance",
      dateTime: "Oct 8, 2023 | 10:00 AM",
      location: "Online",
      type: "Webinar",
      trainer: "Legal Team",
      registered: 42,
      capacity: 50,
      status: "Open",
    },
    {
      id: 2,
      trainingModule: "Workplace Safety & Health",
      dateTime: "Oct 11, 2023 | 2:00 PM",
      location: "Dubai HQ",
      type: "Workshop",
      trainer: "Safety Team",
      registered: 28,
      capacity: 30,
      status: "Almost Full",
    },
    {
      id: 3,
      trainingModule: "UAE Pharmacy Regulations",
      dateTime: "Oct 17, 2023 | 11:00 AM",
      location: "Online",
      type: "Webinar",
      trainer: "Dr. Fatima Al-Mansoori",
      registered: 35,
      capacity: 100,
      status: "Open",
    },
    {
      id: 4,
      trainingModule: "Fire Safety & Emergency Response",
      dateTime: "Oct 23, 2023 | 9:00 AM",
      location: "All Locations",
      type: "In-Person",
      trainer: "Safety Team",
      registered: 580,
      capacity: 612,
      status: "Open",
    },
    {
      id: 5,
      trainingModule: "Data Privacy & GDPR Compliance",
      dateTime: "Oct 26, 2023 | 1:00 PM",
      location: "Online",
      type: "Webinar",
      trainer: "Legal Team",
      registered: 120,
      capacity: 200,
      status: "Open",
    },
    {
      id: 6,
      trainingModule: "Patient Counseling Excellence",
      dateTime: "Oct 31, 2023 | 10:00 AM",
      location: "Abu Dhabi HQ",
      type: "Workshop",
      trainer: "Customer Service Manager",
      registered: 65,
      capacity: 80,
      status: "Open",
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

  // Dummy data for Ratio Compliance table
  const ratioComplianceData = [
    {
      id: 1,
      facility: "Dubai Mall Pharmacy",
      region: "Dubai",
      pharmacists: 4,
      technicians: 6,
      requiredRatio: "1:2",
      currentRatio: "1:1.5",
      status: "Compliant",
    },
    {
      id: 2,
      facility: "Abu Dhabi Marina Pharmacy",
      region: "Abu Dhabi",
      pharmacists: 3,
      technicians: 7,
      requiredRatio: "1:2",
      currentRatio: "1:2.33",
      status: "At Risk",
    },
    {
      id: 3,
      facility: "Sharjah City Center Pharmacy",
      region: "Sharjah",
      pharmacists: 2,
      technicians: 5,
      requiredRatio: "1:2",
      currentRatio: "1:2.5",
      status: "Non-Compliant",
    },
    {
      id: 4,
      facility: "Al Ain Pharmacy",
      region: "Abu Dhabi",
      pharmacists: 2,
      technicians: 3,
      requiredRatio: "1:2",
      currentRatio: "1:1.5",
      status: "Compliant",
    },
    {
      id: 5,
      facility: "Dubai Healthcare City Pharmacy",
      region: "Dubai",
      pharmacists: 5,
      technicians: 8,
      requiredRatio: "1:2",
      currentRatio: "1:1.6",
      status: "Compliant",
    },
  ];

  // Column definitions for Ratio Compliance table
  const ratioComplianceColumns = [
    {
      dataField: "facility",
      text: "Facility",
    },
    {
      dataField: "region",
      text: "Region",
    },
    {
      dataField: "pharmacists",
      text: "Pharmacists",
    },
    {
      dataField: "technicians",
      text: "Technicians",
    },
    {
      dataField: "requiredRatio",
      text: "Required Ratio",
    },
    {
      dataField: "currentRatio",
      text: "Current Ratio",
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
      "Professional",
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

  // Table columns configuration
  const facilityLicensesColumns = [
    {
      dataField: "facilityName",
      text: "Facility Name",
      formatter: (cell, row) => (
        <div className="flex items-center">
          {/* <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <Building className="w-4 h-4 text-blue-600" />
          </div> */}
          <span className="font-medium">{row.facilityName}</span>
        </div>
      ),
    },
    {
      dataField: "licenseNumber",
      text: "License Number",
    },
    {
      dataField: "issuingAuthority",
      text: "Issuing Authority",
    },
    {
      dataField: "issueDate",
      text: "Issue Date",
    },
    {
      dataField: "expiryDate",
      text: "Expiry Date",
    },
    {
      dataField: "location",
      text: "Location",
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
        </div>
      ),
    },
  ];

  const professionalLicensesColumns = [
    {
      dataField: "name",
      text: "Name",
      formatter: (cell, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="font-semibold text-blue-700 text-sm">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      dataField: "licenseNumber",
      text: "License Number",
    },
    {
      dataField: "issuingAuthority",
      text: "Issuing Authority",
    },
    {
      dataField: "issueDate",
      text: "Issue Date",
    },
    {
      dataField: "expiryDate",
      text: "Expiry Date",
    },
    {
      dataField: "primaryLocation",
      text: "Primary Location",
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
          {row.status === "Expiring Soon" && (
            <Button variant="ghost" size="sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const trainingSessionsColumns = [
    {
      dataField: "trainingModule",
      text: "Training Module",
    },
    {
      dataField: "dateTime",
      text: "Date & Time",
    },
    {
      dataField: "location",
      text: "Location",
    },
    {
      dataField: "type",
      text: "Type",
    },
    {
      dataField: "trainer",
      text: "Trainer",
    },
    {
      dataField: "registered",
      text: "Registered",
    },
    {
      dataField: "capacity",
      text: "Capacity",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell, row) => (
        <Badge
          variant={row.status === "Open" ? "success" : "warning"}
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
            <Plus className="w-4 h-4 text-purple-600" />
          </Button>
        </div>
      ),
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "expired":
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      purple: "bg-purple-50 text-purple-600",
      teal: "bg-teal-50 text-teal-600",
      orange: "bg-orange-50 text-orange-600",
      green: "bg-green-50 text-green-600",
      blue: "bg-blue-50 text-blue-600",
      pink: "bg-pink-50 text-pink-600",
      gray: "bg-gray-50 text-gray-600",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

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

          {/* Facility Licensing Tab */}
          <TabsContent value="facility">
            {/* Sub Tabs */}
            <Tabs
              value={activeSubTab}
              onValueChange={setActiveSubTab}
              className="mb-6"
            >
              <TabsList className="grid-cols-3">
                <TabsTrigger value="retail-licenses">
                  Retail Licenses
                </TabsTrigger>
                <TabsTrigger value="warehouse-licenses">
                  Warehouse Licenses
                </TabsTrigger>
                <TabsTrigger value="renewal-tracking">
                  Renewal Tracking
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Facilities</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">238</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        ↑ 12
                      </span>
                      <span className="text-gray-500">from last year</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Licenses Expiring</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">14</p>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 font-medium">
                        Within 60 days
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Renewal In Progress</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">8</p>
                    <div className="flex items-center text-sm">
                      <span className="text-blue-500 font-medium">
                        Applications submitted
                      </span>
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
                    <p className="text-3xl font-bold text-gray-900">98%</p>
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
                      Region
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option>All Regions</option>
                      <option>Dubai</option>
                      <option>Abu Dhabi</option>
                      <option>Sharjah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Expiring Soon</option>
                      <option>Expired</option>
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
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add License
                  </Button>
                </div>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="retail-licenses">
                <Card>
                  <CardHeader>
                    <CardTitle>Retail Pharmacy Licenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableCustom
                      columns={facilityLicensesColumns}
                      data={facilityLicensesData}
                      pagination={true}
                      dataTotalSize={facilityLicensesData.length}
                      tableOptions={{ page: 1, sizePerPage: 10 }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="warehouse-licenses">
                <Card>
                  <CardHeader>
                    <CardTitle>Warehouse Licenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TableCustom
                      columns={facilityLicensesColumns}
                      data={facilityLicensesData.slice(0, 2)} // Show fewer items for warehouse
                      pagination={true}
                      dataTotalSize={2}
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
                      data={facilityLicensesData.filter(
                        (item) => item.status === "Expiring Soon"
                      )}
                      pagination={true}
                      dataTotalSize={
                        facilityLicensesData.filter(
                          (item) => item.status === "Expiring Soon"
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

          {/* Professional Licensing Tab */}
          <TabsContent value="professional">
            {/* Sub Tabs */}
            <Tabs
              value={activeProfessionalSubTab}
              onValueChange={setActiveProfessionalSubTab}
              className="mb-6"
            >
              <TabsList className="grid-cols-4">
                <TabsTrigger value="pharmacist-licenses">
                  Pharmacist Licenses
                </TabsTrigger>
                <TabsTrigger value="technician-certifications">
                  Technician Certifications
                </TabsTrigger>
                <TabsTrigger value="specialized-credentials">
                  Specialized Credentials
                </TabsTrigger>
                <TabsTrigger value="license-verification">
                  License Verification
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Professionals</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-teal-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">612</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        ↑ 24
                      </span>
                      <span className="text-gray-500">from last year</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Licenses Expiring</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">18</p>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 font-medium">
                        Within 60 days
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Renewal In Progress</h3>
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
                    <h3 className="text-sm font-medium">Compliance Rate</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">99%</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        ↑ 1%
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
                      Region
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option>All Regions</option>
                      <option>Dubai</option>
                      <option>Abu Dhabi</option>
                      <option>Sharjah</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Expiring Soon</option>
                      <option>Expired</option>
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
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add License
                  </Button>
                </div>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="pharmacist-licenses">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Pharmacist Licenses
                  </h2>
                  <TableCustom
                    columns={professionalLicensesColumns}
                    data={professionalLicensesData}
                    tableOptions={{
                      pagination: true,
                      paginationSize: 10,
                      paginationSizePerPageList: [10, 20, 50],
                      showTotal: true,
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="technician-certifications">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Technician Certifications
                  </h2>
                  <TableCustom
                    columns={professionalLicensesColumns}
                    data={professionalLicensesData.slice(0, 2)}
                    pagination={true}
                    dataTotalSize={2}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="specialized-credentials">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Specialized Credentials
                  </h2>
                  <TableCustom
                    columns={professionalLicensesColumns}
                    data={professionalLicensesData.slice(1, 3)}
                    pagination={true}
                    dataTotalSize={2}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="license-verification">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    License Verification
                  </h2>
                  <TableCustom
                    columns={professionalLicensesColumns}
                    data={professionalLicensesData}
                    pagination={true}
                    dataTotalSize={professionalLicensesData.length}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Mandatory Training Tab */}
          <TabsContent value="training">
            {/* Sub Tabs */}
            <Tabs
              value={activeTrainingSubTab}
              onValueChange={setActiveTrainingSubTab}
              className="mb-6"
            >
              <TabsList className="grid-cols-4">
                <TabsTrigger value="training-modules">
                  Training Modules
                </TabsTrigger>
                <TabsTrigger value="staff-completion">
                  Staff Completion
                </TabsTrigger>
                <TabsTrigger value="overdue-training">
                  Overdue Training
                </TabsTrigger>
                <TabsTrigger value="training-calendar">
                  Training Calendar
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Staff</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">612</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Requiring training</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Fully Compliant</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">563</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        92% of total
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Training Due</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">41</p>
                    <div className="flex items-center text-sm">
                      <span className="text-yellow-500 font-medium">
                        Within 30 days
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Overdue</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">6</p>
                    <div className="flex items-center text-sm">
                      <span className="text-red-500 font-medium">
                        Require immediate action
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Filters and Actions */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Training Type
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option>All Types</option>
                      <option>Mandatory</option>
                      <option>Professional Development</option>
                      <option>Emergency Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="border border-gray-300 rounded-md px-3 py-2">
                      <option>All Statuses</option>
                      <option>Open</option>
                      <option>Almost Full</option>
                      <option>Completed</option>
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
                  <Button className="flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Training
                  </Button>
                </div>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="training-modules">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Mandatory Training Modules
                  </h2>
                  <TableCustom
                    columns={trainingSessionsColumns}
                    data={trainingSessionsData}
                    pagination={true}
                    dataTotalSize={trainingSessionsData.length}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="staff-completion">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Staff Completion</h2>
                  <TableCustom
                    columns={trainingSessionsColumns}
                    data={trainingSessionsData.slice(0, 3)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="overdue-training">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Overdue Training</h2>
                  <TableCustom
                    columns={trainingSessionsColumns}
                    data={trainingSessionsData.slice(2, 4)}
                    pagination={true}
                    dataTotalSize={2}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="training-calendar">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Upcoming Training Sessions
                  </h2>
                  <TableCustom
                    columns={trainingSessionsColumns}
                    data={trainingSessionsData}
                    tableOptions={{
                      pagination: true,
                      paginationSize: 10,
                      paginationSizePerPageList: [10, 20, 50],
                      showTotal: true,
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Ratio Compliance Tab */}
          <TabsContent value="ratio">
            {/* Sub Tabs */}
            <Tabs
              value={activeRatioSubTab}
              onValueChange={setActiveRatioSubTab}
              className="mb-6"
            >
              <TabsList className="grid-cols-4">
                <TabsTrigger value="current-ratios">Current Ratios</TabsTrigger>
                <TabsTrigger value="scheduling-compliance">
                  Scheduling Compliance
                </TabsTrigger>
                <TabsTrigger value="historical-compliance">
                  Historical Compliance
                </TabsTrigger>
                <TabsTrigger value="regulatory-requirements">
                  Regulatory Requirements
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Total Locations</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">238</p>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Being monitored</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Compliant Locations</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">226</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 font-medium mr-1">
                        95% of total
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Non-Compliant</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <div className="flex items-center text-sm">
                      <span className="text-red-500 font-medium mr-1">
                        Require attention
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Avg. Compliance</h3>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                      <Scale className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-gray-900">95%</p>
                    <div className="flex items-center text-sm">
                      <span className="text-orange-500 font-medium mr-1">
                        ↑ 3%
                      </span>
                      <span className="text-gray-500">from last quarter</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sub Tab Content */}
              <TabsContent value="current-ratios">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Pharmacist-to-Technician Ratio Compliance
                  </h2>
                  <TableCustom
                    columns={ratioComplianceColumns}
                    data={ratioComplianceData}
                    pagination={true}
                    dataTotalSize={ratioComplianceData.length}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="scheduling-compliance">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Scheduling Compliance
                  </h2>
                  <TableCustom
                    columns={ratioComplianceColumns}
                    data={ratioComplianceData.slice(0, 3)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="historical-compliance">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Historical Compliance
                  </h2>
                  <TableCustom
                    columns={ratioComplianceColumns}
                    data={ratioComplianceData.slice(2, 5)}
                    pagination={true}
                    dataTotalSize={3}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="regulatory-requirements">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    Regulatory Requirements
                  </h2>
                  <TableCustom
                    columns={ratioComplianceColumns}
                    data={ratioComplianceData}
                    pagination={true}
                    dataTotalSize={ratioComplianceData.length}
                    tableOptions={{ page: 1, sizePerPage: 10 }}
                  />
                </div>
              </TabsContent>
            </Tabs>
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
                      <span className="font-medium mr-1">
                        hours/week
                      </span>
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
    </div>
  );
};

export default Compliance;
