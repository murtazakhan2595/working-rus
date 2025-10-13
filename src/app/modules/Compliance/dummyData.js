import { Button } from "components/ui/button";
import {
  Building,
  Building2,
  CheckCircle,
  Edit,
  Eye,
  FileText,
  GraduationCap,
  Plus,
  RefreshCw,
  RotateCcw,
  Scale,
  User,
  UserCheck,
  Users,
} from "lucide-react";

import { Badge } from "components/ui/badge";

export const stats = [
  {
    id: "facility",
    icon: Building2,
    label: "Licensing",
    fullName: "Branch & Licensing",
    value: "98%",
    color: "text-primary-1100",
    bgColor: "bg-primary-200",
  },
  {
    id: "license-certificates",
    icon: UserCheck,
    label: "Employee Certificates",
    fullName: "Employee Certificates",
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
    id: "workforce",
    icon: Users,
    label: "Workforce",
    fullName: "Workforce Regulations",
    value: "100%",
    color: "text-slate-900",
    bgColor: "bg-slate-100",
  },
];

// Dummy data for facility licensing table
export const facilityLicensesData = [
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
export const employeeLicensesData = [
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

// Dummy data for SOP & Policy table
export const sopPolicyData = [
  {
    id: 1,
    documentName: "Employee Code of Conduct",
    category: "HR",
    noOfAssignees: 245,
    acknowledged: 238,
    notAcknowledged: 7,
    acknowledgmentPercentage: 97,
    dueDate: "2024-01-15",
    branch: "All Branches",
  },
  {
    id: 2,
    documentName: "Workplace Safety Policy",
    category: "Safety",
    noOfAssignees: 245,
    acknowledged: 240,
    notAcknowledged: 5,
    acknowledgmentPercentage: 98,
    dueDate: "2024-01-20",
    branch: "All Branches",
  },
  {
    id: 3,
    documentName: "Data Protection Policy",
    category: "IT",
    noOfAssignees: 245,
    acknowledged: 220,
    notAcknowledged: 25,
    acknowledgmentPercentage: 90,
    dueDate: "2024-01-25",
    branch: "All Branches",
  },
  {
    id: 4,
    documentName: "Leave Management Policy",
    category: "HR",
    noOfAssignees: 245,
    acknowledged: 235,
    notAcknowledged: 10,
    acknowledgmentPercentage: 96,
    dueDate: "2024-01-30",
    branch: "All Branches",
  },
  {
    id: 5,
    documentName: "Financial Controls Policy",
    category: "Finance",
    noOfAssignees: 245,
    acknowledged: 200,
    notAcknowledged: 45,
    acknowledgmentPercentage: 82,
    dueDate: "2024-02-05",
    branch: "All Branches",
  },
  {
    id: 6,
    documentName: "IT Security Guidelines",
    category: "IT",
    noOfAssignees: 245,
    acknowledged: 210,
    notAcknowledged: 35,
    acknowledgmentPercentage: 86,
    dueDate: "2024-02-10",
    branch: "All Branches",
  },
  {
    id: 7,
    documentName: "Customer Service Standards",
    category: "Operations",
    noOfAssignees: 245,
    acknowledged: 245,
    notAcknowledged: 0,
    acknowledgmentPercentage: 100,
    dueDate: "2024-02-15",
    branch: "All Branches",
  },
  {
    id: 8,
    documentName: "Quality Assurance Procedures",
    category: "Quality",
    noOfAssignees: 245,
    acknowledged: 230,
    notAcknowledged: 15,
    acknowledgmentPercentage: 94,
    dueDate: "2024-02-20",
    branch: "All Branches",
  },
];

// Dummy data for mandatory training table
export const mandatoryTrainingData = [
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

// Dummy data for Employee Contracts table
export const employeeContractsData = [
  {
    id: 1,
    employeeId: "EMP001",
    employeeName: "Sarah Ahmed",
    designation: "Pharmacist",
    branch: "Dubai Mall Pharmacy",
    contractType: "Permanent",
    contractDuration: "3 Years",
    startDate: "2023-01-15",
    endDate: "2026-01-15",
    daysRemaining: 365,
    status: "Active",
  },
  {
    id: 2,
    employeeId: "EMP002",
    employeeName: "Mohammed Khan",
    designation: "Pharmacy Technician",
    branch: "Abu Dhabi Marina Pharmacy",
    contractType: "Fixed-term",
    contractDuration: "2 Years",
    startDate: "2022-11-03",
    endDate: "2024-11-03",
    daysRemaining: 15,
    status: "Expiring Soon",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employeeName: "John Anderson",
    designation: "Pharmacist",
    branch: "Dubai Healthcare City Pharmacy",
    contractType: "Consultant",
    contractDuration: "1 Year",
    startDate: "2023-03-20",
    endDate: "2024-03-20",
    daysRemaining: 45,
    status: "Expiring Soon",
  },
  {
    id: 4,
    employeeId: "EMP004",
    employeeName: "Fatima Al-Zahra",
    designation: "Manager",
    branch: "Sharjah City Center Pharmacy",
    contractType: "Permanent",
    contractDuration: "3 Years",
    startDate: "2023-06-10",
    endDate: "2026-06-10",
    daysRemaining: 520,
    status: "Active",
  },
  {
    id: 5,
    employeeId: "EMP005",
    employeeName: "Ahmed Hassan",
    designation: "Supervisor",
    branch: "Al Ain Pharmacy",
    contractType: "Fixed-term",
    contractDuration: "2 Years",
    startDate: "2022-08-15",
    endDate: "2024-08-15",
    daysRemaining: -30,
    status: "Expired",
  },
  {
    id: 6,
    employeeId: "EMP006",
    employeeName: "Lisa Johnson",
    designation: "Pharmacist",
    branch: "Dubai Mall Pharmacy",
    contractType: "Permanent",
    contractDuration: "3 Years",
    startDate: "2023-02-01",
    endDate: "2026-02-01",
    daysRemaining: 400,
    status: "Active",
  },
  {
    id: 7,
    employeeId: "EMP007",
    employeeName: "Omar Al-Rashid",
    designation: "Pharmacy Technician",
    branch: "Sharjah City Center Pharmacy",
    contractType: "Probation",
    contractDuration: "6 Months",
    startDate: "2023-10-15",
    endDate: "2024-04-15",
    daysRemaining: 90,
    status: "Active",
  },
  {
    id: 8,
    employeeId: "EMP008",
    employeeName: "Maria Rodriguez",
    designation: "Cashier",
    branch: "Abu Dhabi Marina Pharmacy",
    contractType: "Fixed-term",
    contractDuration: "1 Year",
    startDate: "2023-07-20",
    endDate: "2024-07-20",
    daysRemaining: 180,
    status: "Active",
  },
  {
    id: 9,
    employeeId: "EMP009",
    employeeName: "David Wilson",
    designation: "Pharmacist",
    branch: "Fujairah Pharmacy",
    contractType: "Consultant",
    contractDuration: "6 Months",
    startDate: "2023-12-01",
    endDate: "2024-06-01",
    daysRemaining: 120,
    status: "Active",
  },
  {
    id: 10,
    employeeId: "EMP010",
    employeeName: "Aisha Al-Mansouri",
    designation: "Manager",
    branch: "Ajman Pharmacy",
    contractType: "Permanent",
    contractDuration: "3 Years",
    startDate: "2022-05-10",
    endDate: "2025-05-10",
    daysRemaining: -60,
    status: "Expired",
  },
];

// Dummy data for Working Hours table
export const workingHoursData = [
  {
    id: 1,
    branchName: "Dubai Mall Pharmacy",
    region: "Dubai",
    totalStaff: 45,
    avgWeeklyHours: 46.2,
    overtimeHours: 2.1,
    legalLimit: 48,
    status: "Compliant",
  },
  {
    id: 2,
    branchName: "Abu Dhabi Marina Pharmacy",
    region: "Abu Dhabi",
    totalStaff: 38,
    avgWeeklyHours: 47.8,
    overtimeHours: 3.2,
    legalLimit: 48,
    status: "At Risk",
  },
  {
    id: 3,
    branchName: "Sharjah City Center Pharmacy",
    region: "Sharjah",
    totalStaff: 42,
    avgWeeklyHours: 49.1,
    overtimeHours: 5.3,
    legalLimit: 48,
    status: "Non-Compliant",
  },
  {
    id: 4,
    branchName: "Dubai Healthcare City Pharmacy",
    region: "Dubai",
    totalStaff: 52,
    avgWeeklyHours: 45.8,
    overtimeHours: 1.2,
    legalLimit: 48,
    status: "Compliant",
  },
  {
    id: 5,
    branchName: "Al Ain Pharmacy",
    region: "Al Ain",
    totalStaff: 28,
    avgWeeklyHours: 47.5,
    overtimeHours: 2.8,
    legalLimit: 48,
    status: "At Risk",
  },
  {
    id: 6,
    branchName: "Fujairah Pharmacy",
    region: "Fujairah",
    totalStaff: 22,
    avgWeeklyHours: 44.2,
    overtimeHours: 0.8,
    legalLimit: 48,
    status: "Compliant",
  },
  {
    id: 7,
    branchName: "Ajman Pharmacy",
    region: "Ajman",
    totalStaff: 35,
    avgWeeklyHours: 48.5,
    overtimeHours: 4.1,
    legalLimit: 48,
    status: "At Risk",
  },
  {
    id: 8,
    branchName: "Ras Al Khaimah Pharmacy",
    region: "Ras Al Khaimah",
    totalStaff: 31,
    avgWeeklyHours: 46.8,
    overtimeHours: 1.9,
    legalLimit: 48,
    status: "Compliant",
  },
];

// Column definitions for Employee Contracts table
export const employeeContractsColumns = [
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
    dataField: "contractType",
    text: "Contract Type",
    formatter: (cell, row) => (
      <Badge
        variant={
          row.contractType === "Permanent"
            ? "success"
            : row.contractType === "Fixed-term"
            ? "warning"
            : row.contractType === "Consultant"
            ? "secondary"
            : "default"
        }
        className="capitalize"
      >
        {row.contractType}
      </Badge>
    ),
  },
  {
    dataField: "contractDuration",
    text: "Contract Duration",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.contractDuration}</span>
    ),
  },
  {
    dataField: "startDate",
    text: "Start Date",
  },
  {
    dataField: "endDate",
    text: "End Date",
  },
  {
    dataField: "daysRemaining",
    text: "Days Remaining",
    formatter: (cell, row) => (
      <span
        className={`font-semibold ${
          row.daysRemaining < 0
            ? "text-red-600"
            : row.daysRemaining <= 30
            ? "text-orange-600"
            : "text-green-600"
        }`}
      >
        {row.daysRemaining < 0 ? "Expired" : `${row.daysRemaining} days`}
      </span>
    ),
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
            : row.status === "Expired"
            ? "destructive"
            : "secondary"
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
            console.log("View contract details for:", row);
          }}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Renew contract for:", row);
          }}
          title="Renew"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Upload contract for:", row);
          }}
          title="Upload"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

// Column definitions for Working Hours table
export const workingHoursColumns = [
  {
    dataField: "branchName",
    text: "Branch Name",
    formatter: (cell, row) => (
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <Building className="w-4 h-4 text-blue-700" />
        </div>
        <span className="font-medium">{row.branchName}</span>
      </div>
    ),
  },
  {
    dataField: "region",
    text: "Region",
  },
  {
    dataField: "totalStaff",
    text: "Total Staff",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.totalStaff}</span>
    ),
  },
  {
    dataField: "avgWeeklyHours",
    text: "Avg. Weekly Hours",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.avgWeeklyHours}</span>
    ),
  },
  {
    dataField: "overtimeHours",
    text: "Overtime Hours",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.overtimeHours}</span>
    ),
  },
  {
    dataField: "legalLimit",
    text: "Legal Limit",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.legalLimit}</span>
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
export const workforceRegulationsData = [
  {
    id: 1,
    regulationArea: "Working Hours",
    requirement: "Maximum 48 hours per week (8 hours per day)",
    currentStatus: "Average: 46.2 hours/week",
    branchCompliant: "238 / 238",
    lastVerified: "2024-01-15",
    status: "Compliant",
    categoryType: "Working Hours",
  },
  {
    id: 2,
    regulationArea: "Annual Leave",
    requirement: "30 days annual leave after 1 year of service",
    currentStatus: "Tracked and accrued properly",
    branchCompliant: "235 / 238",
    lastVerified: "2024-01-10",
    status: "At Risk",
    categoryType: "Leave",
  },
  {
    id: 3,
    regulationArea: "Sick Leave",
    requirement: "90 days per year (15 full pay, 30 half pay)",
    currentStatus: "Properly documented and tracked",
    branchCompliant: "238 / 238",
    lastVerified: "2024-01-12",
    status: "Compliant",
    categoryType: "Leave",
  },
  {
    id: 4,
    regulationArea: "End of Service Benefits",
    requirement: "21 days salary per year (1-5 years service)",
    currentStatus: "Calculated and reserved correctly",
    branchCompliant: "230 / 238",
    lastVerified: "2024-01-08",
    status: "At Risk",
    categoryType: "End of Service",
  },
  {
    id: 5,
    regulationArea: "Wage Protection System",
    requirement: "WPS registration mandatory for all employees",
    currentStatus: "All staff registered in WPS",
    branchCompliant: "238 / 238",
    lastVerified: "2024-01-14",
    status: "Compliant",
    categoryType: "Wages",
  },
  {
    id: 6,
    regulationArea: "Overtime Compensation",
    requirement: "125% of basic salary for overtime hours",
    currentStatus: "Overtime rates not properly calculated",
    branchCompliant: "180 / 238",
    lastVerified: "2024-01-05",
    status: "Non-Compliant",
    categoryType: "Wages",
  },
  {
    id: 7,
    regulationArea: "Maternity Leave",
    requirement: "45 days paid maternity leave",
    currentStatus: "Maternity leave properly implemented",
    branchCompliant: "238 / 238",
    lastVerified: "2024-01-11",
    status: "Compliant",
    categoryType: "Leave",
  },
  {
    id: 8,
    regulationArea: "Probation Period",
    requirement: "Maximum 6 months probation period",
    currentStatus: "Probation periods extended beyond limit",
    branchCompliant: "200 / 238",
    lastVerified: "2024-01-09",
    status: "At Risk",
    categoryType: "Employment",
  },
];

// Column definitions for Workforce Regulations table
export const workforceRegulationsColumns = [
  {
    dataField: "regulationArea",
    text: "Regulation Area",
    formatter: (cell, row) => (
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <Scale className="w-4 h-4 text-blue-700" />
        </div>
        <span className="font-medium">{row.regulationArea}</span>
      </div>
    ),
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
    dataField: "branchCompliant",
    text: "Branch Compliant",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.branchCompliant}</span>
    ),
  },
  {
    dataField: "lastVerified",
    text: "Last Verified",
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Mark reviewed for:", row);
          }}
          title="Mark Reviewed"
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Update for:", row);
          }}
          title="Update"
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

// Dummy data for Compliance Ratio table
export const complianceRatioData = [
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
export const complianceRatioColumns = [
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

// Dummy data for compliance overview cards
export const complianceStats = [
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
    title: "Employee Certificates",
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
    id: "workforce",
    title: "Workforce Regulations",
    percentage: 100,
    status: "valid",
    icon: Users,
    color: "gray",
  },
];

// Table columns configuration for SOP & Policy
export const sopPolicyColumns = [
  {
    dataField: "documentName",
    text: "Document Name",
    formatter: (cell, row) => (
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <FileText className="w-4 h-4 text-blue-700" />
        </div>
        <span className="font-medium">{row.documentName}</span>
      </div>
    ),
  },
  {
    dataField: "category",
    text: "Category",
    formatter: (cell, row) => (
      <Badge
        variant={
          row.category === "HR"
            ? "success"
            : row.category === "IT"
            ? "secondary"
            : row.category === "Safety"
            ? "warning"
            : row.category === "Finance"
            ? "destructive"
            : "default"
        }
        className="capitalize"
      >
        {row.category}
      </Badge>
    ),
  },
  {
    dataField: "noOfAssignees",
    text: "No. of Assignees",
    formatter: (cell, row) => (
      <span className="font-semibold">{row.noOfAssignees}</span>
    ),
  },
  {
    dataField: "acknowledged",
    text: "Acknowledged",
    formatter: (cell, row) => (
      <span className="font-semibold text-green-600">{row.acknowledged}</span>
    ),
  },
  {
    dataField: "notAcknowledged",
    text: "Not Acknowledged",
    formatter: (cell, row) => (
      <span className="font-semibold text-red-600">{row.notAcknowledged}</span>
    ),
  },
  {
    dataField: "acknowledgmentPercentage",
    text: "Acknowledgment %",
    formatter: (cell, row) => (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
          <div
            className={`h-2.5 rounded-full ${
              row.acknowledgmentPercentage >= 95
                ? "bg-green-500"
                : row.acknowledgmentPercentage >= 80
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${row.acknowledgmentPercentage}%` }}
          ></div>
        </div>
        <span className="font-semibold">{row.acknowledgmentPercentage}%</span>
      </div>
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
            console.log("View acknowledgment details for:", row);
          }}
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];

// Table columns configuration for mandatory training
export const mandatoryTrainingColumns = [
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
export const employeeLicensesColumns = [
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
